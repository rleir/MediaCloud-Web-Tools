# -*- coding: utf-8 -*-
import logging
from flask import jsonify, request
import flask_login

from server import app, db, mc
from server.util.mail import send_email
from server.util.request import form_fields_required, api_error_handler, arguments_required
from server.auth import user_mediacloud_key, user_mediacloud_client, user_name, is_user_logged_in
from server.views.topics.apicache import cached_topic_timespan_list
from server.views.topics import access_public_topic, CACHED_TOPICS

logger = logging.getLogger(__name__)

@app.route('/api/topics/list', methods=['GET'])
@api_error_handler
def topic_list():
    if (not is_user_logged_in()):
        return public_topic_list(CACHED_TOPICS)
    else:
        user_mc= user_mediacloud_client()
        link_id = request.args.get('linkId')
        all_topics = user_mc.topicList(link_id=link_id)
        _add_user_favorite_flag_to_topics(all_topics['topics'])
    return jsonify(all_topics)

@api_error_handler
def public_topic_list(topic_list):
    all_public_topics = []
    for topic in topic_list:
        if (topic['is_public'] == 1):
            all_public_topics.append(topic)
    return jsonify({"topics": all_public_topics})

@app.route('/api/topics/<topics_id>/summary', methods=['GET'])
@api_error_handler
def topic_summary(topics_id):
    local_mc = None
    if (access_public_topic(topics_id)):
        local_mc = mc
    elif is_user_logged_in():
        local_mc = user_mediacloud_client()
    else:
        return jsonify({'status': 'Error', 'message': 'Invalid attempt'})

    topic = local_mc.topic(topics_id)
    topic['snapshot_status'] = mc.topicSnapshotGenerateStatus(topics_id)    # need to know if snapshot is running
    if is_user_logged_in():
        _add_user_favorite_flag_to_topics([topic])
    return jsonify(topic)

def _add_user_favorite_flag_to_topics(topics):
    user_favorited = db.get_users_lists(user_name(), 'favoriteTopics')
    for t in topics:
        t['isFavorite'] = t['topics_id'] in user_favorited
    return topics

@app.route('/api/topics/<topics_id>/snapshots/list', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_snapshots_list(topics_id):
    user_mc = user_mediacloud_client()
    snapshots = user_mc.topicSnapshotList(topics_id)
    return jsonify({'list':snapshots})

@app.route('/api/topics/<topics_id>/snapshots/generate', methods=['POST'])
@flask_login.login_required
@api_error_handler
def topic_snapshot_generate(topics_id):
    user_mc = user_mediacloud_client()
    results = user_mc.topicGenerateSnapshot(topics_id)
    return jsonify(results)

@app.route('/api/topics/<topics_id>/snapshots/<snapshots_id>/timespans/list', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_timespan_list(topics_id, snapshots_id):
    foci_id = request.args.get('focusId')
    timespans = cached_topic_timespan_list(user_mediacloud_key(), topics_id, snapshots_id, foci_id)
    return jsonify({'list':timespans})

@app.route('/api/topics/<topics_id>/favorite', methods=['PUT'])
@flask_login.login_required
@form_fields_required('favorite')
@api_error_handler
def topic_set_favorited(topics_id):
    favorite = request.form["favorite"]
    username = user_name()
    if int(favorite) == 1:
        db.add_item_to_users_list(username, 'favoriteTopics', int(topics_id))
    else:
        db.remove_item_from_users_list(username, 'favoriteTopics', int(topics_id))
    return jsonify({'isFavorite':favorite})

@app.route('/api/topics/favorite', methods=['GET'])
@flask_login.login_required
@api_error_handler
def favorite_topics():
    user_mc = user_mediacloud_client()
    user_favorited = db.get_users_lists(user_name(), 'favoriteTopics')
    favorited_topics = [user_mc.topic(topic_id) for topic_id in user_favorited]
    for t in favorited_topics:
        t['isFavorite'] = True
    return jsonify({'topics': favorited_topics})

@app.route('/api/topics/<topics_id>/update', methods=['PUT'])
@flask_login.login_required
@form_fields_required('name', 'description', 'public')
@api_error_handler
def topic_update(topics_id):
    return topic_summary(topics_id) # give them back new data, so they can update the client

@app.route('/api/topics/suggest', methods=['PUT'])
@flask_login.login_required
@form_fields_required('name', 'description', 'seedQuery', 'reason')
@api_error_handler
def topic_suggest():
    spidered = False
    if 'spidered' in request.form:
        spidered = request.form['spidered'] is '1'
    content = """
Hi,

{username} just requested a new Topic be created with the following info:

Name: {name}

Description: {description}

Seed Query: {seedQuery}

Reason: {reason}

Spidered?: {spidered}

Sincerely,

Your friendly Media Cloud Topic Mapper server
🎓👓

https://topics.mediacloud.org
    """
    send_email('no-reply@mediacloud.org',
        [user_name(),'topic-request@mediacloud.org'],
        'New Topic Request: '+request.form['name'],
        content.format(
            username=user_name(),
            name=request.form['name'],
            description=request.form['description'],
            seedQuery=request.form['seedQuery'],
            reason=request.form['reason'],
            spidered=spidered
        ))
    return jsonify({'success': 1})
