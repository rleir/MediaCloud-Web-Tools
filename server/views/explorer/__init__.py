import logging
from flask import request, jsonify, send_from_directory
import os
import datetime as dt
import flask_login
import json
import datetime
from slugify import slugify

from server import mc, app, analytics_db
from server.auth import is_user_logged_in
from server.util.request import api_error_handler
from server.views.media_picker import concatenate_query_for_solr

logger = logging.getLogger(__name__)

SORT_SOCIAL = 'social'
SORT_INLINK = 'inlink'
DEFAULT_COLLECTION_IDS = [9139487]


def validated_sort(desired_sort, default_sort=SORT_SOCIAL):
    valid_sorts = [SORT_SOCIAL, SORT_INLINK]
    if (desired_sort is None) or (desired_sort not in valid_sorts):
        return default_sort
    return desired_sort


def topic_is_public(topics_id):
    topic = mc.topic(topics_id)
    is_public = topic['is_public']
    return int(is_public) == 1


def access_public_topic(topics_id):
    # check whether logged in here since it is a requirement for public access
    if (not is_user_logged_in()) and (topic_is_public(topics_id)):
        return True
    return False


def dates_as_filter_query(start_date, end_date):
    date_query = ""
    if start_date:
        testa = datetime.datetime.strptime(start_date, '%Y-%m-%d').date()
        testb = datetime.datetime.strptime(end_date, '%Y-%m-%d').date()
        date_query = mc.publish_date_query(testa, testb, True, True)
    return date_query


def _default_query_dates():
    one_month_before_now = datetime.datetime.now() - datetime.timedelta(days=30)
    default_start_date = one_month_before_now
    default_end_date = datetime.datetime.now()
    return default_start_date, default_end_date


def parse_query_dates(args):
    default_start_date, default_end_date = _default_query_dates()
    if 'startDate' in args:
        start_date = dt.datetime.strptime(args['startDate'], "%Y-%m-%d")
    elif 'start_date' in args:
        start_date = dt.datetime.strptime(args['start_date'], "%Y-%m-%d")
    else:
        start_date = default_start_date
    if 'endDate' in args:
        end_date = dt.datetime.strptime(args['endDate'], "%Y-%m-%d")
    elif 'end_date' in args:
        end_date = dt.datetime.strptime(args['end_date'], "%Y-%m-%d")
    else:
        end_date = default_end_date
    return start_date, end_date


def _parse_media_ids(args):
    media_ids = []
    if 'sources' in args:
        if isinstance(args['sources'], str):
            media_ids = args['sources'].split(',') if 'sources' in args and len(args['sources']) > 0 else []
        else:
            media_ids = args['sources']
    return media_ids


def _parse_collection_ids(args):
    if 'collections' in args:
        if isinstance(args['collections'], str):
            if len(args['collections']) == 0:
                tags_ids = []
            else:
                tags_ids = args['collections'].split(',')  # make a list
        else:
            tags_ids = args['collections']
    else:
        tags_ids = DEFAULT_COLLECTION_IDS
    return tags_ids


REDDIT_SOURCE = 1254159  # a placeholder source to mark searching Reddit's biggest news-related subs


def only_queries_reddit(args):
    if isinstance(args, list):
        return (len(args) == 1) and (int(args[0]) == REDDIT_SOURCE)
    media_ids = _parse_media_ids(args)
    collection_ids = _parse_collection_ids(args)
    return (len(collection_ids) == 0) and (len(media_ids) == 1) and (int(media_ids[0]) == REDDIT_SOURCE)


def parse_query_with_keywords(args):
    solr_q = ''
    solr_fq = None
    # should I break this out into just a demo routine where we add in the start/end date without relying that the
    # try statement will fail?
    try:    # if user arguments are present and allowed by the client endpoint, use them, otherwise use defaults
        current_query = args['q']
        if current_query == '':
            current_query = "*"
        start_date, end_date = parse_query_dates(args)
        media_ids = _parse_media_ids(args)
        collections = _parse_collection_ids(args)
        searches = args['searches'] if 'searches' in args else []
        solr_q = concatenate_query_for_solr(solr_seed_query=current_query,
                                            media_ids=media_ids,
                                            tags_ids=collections,
                                            custom_ids=searches)
        solr_fq = dates_as_filter_query(start_date.strftime("%Y-%m-%d"), end_date.strftime("%Y-%m-%d"))
    # otherwise, default
    except Exception as e:
        logger.warning("user custom query failed, there's a problem with the arguments " + str(e))
    return solr_q, solr_fq


def _parse_query_for_sample_search(sample_search_id, query_id):
    these_sample_searches = load_sample_searches()
    current_query_info = these_sample_searches[int(sample_search_id)]['queries'][int(query_id)]
    solr_q = concatenate_query_for_solr(solr_seed_query=current_query_info['q'],
                                        media_ids=current_query_info['sources'],
                                        tags_ids=current_query_info['collections'])
    solr_fq = dates_as_filter_query(current_query_info['startDate'], current_query_info['endDate'])
    return solr_q, solr_fq


def parse_as_sample(search_id_or_query, query_id=None):
    try:
        if isinstance(search_id_or_query, int):  # special handling for an indexed query
            sample_search_id = search_id_or_query
            return _parse_query_for_sample_search(sample_search_id, query_id)

    except Exception as e:
        logger.warning("error " + str(e))


sample_searches = None  # use as singeton, not cache so that we can change the file and restart and see changes


def load_sample_searches():
    global sample_searches
    if sample_searches is None:
        json_file = os.path.join(os.path.dirname(__file__), '../..', 'static/data/sample_searches.json')
        # load the sample searches file
        with open(json_file) as json_data:
            d = json.load(json_data)
            sample_searches = d
    return sample_searches


def read_sample_searches():
    json_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..', 'static/data'))

    # load the sample searches file
    return send_from_directory(json_dir, 'sample_searches.json', as_attachment=True)


def file_name_for_download(label, type_of_download):
    length_limited_label = label
    if len(label) > 30:
        length_limited_label = label[:30]
    return '{}-{}'.format(slugify(length_limited_label), type_of_download)


@app.route('/api/explorer/count-stats', methods=['GET'])
@flask_login.login_required
@api_error_handler
def count_stats():
    # count the uses of sources or collection whenever the user clicks the search button
    sources = request.args['sources'].split(",") if 'sources' in request.args else None
    collections = request.args['collections'].split(",") if 'collections' in request.args else None
    for media_id in sources:
        analytics_db.increment_count(analytics_db.TYPE_MEDIA, media_id,
                                     analytics_db.ACTION_EXPLORER_QUERY, sources.count(media_id))
    for collection_id in collections:
        analytics_db.increment_count(analytics_db.TYPE_COLLECTION, collection_id,
                                     analytics_db.ACTION_EXPLORER_QUERY, collections.count(collection_id))
    return jsonify({'status': 'ok'})
