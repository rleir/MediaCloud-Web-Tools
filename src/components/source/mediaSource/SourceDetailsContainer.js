import React from 'react';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import Link from 'react-router/lib/Link';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import DataCard from '../../common/DataCard';
import Permissioned from '../../common/Permissioned';
import { PERMISSION_MEDIA_EDIT } from '../../../lib/auth';
import CollectionList from '../../common/CollectionList';
import SourceSentenceCountContainer from './SourceSentenceCountContainer';
import SourceTopWordsContainer from './SourceTopWordsContainer';
import SourceGeographyContainer from './SourceGeographyContainer';
import HealthBadge from '../HealthBadge';
import { isMetaDataTagSet, isCollectionTagSet } from '../../../lib/tagUtil';
import { SOURCE_SCRAPE_STATE_QUEUED, SOURCE_SCRAPE_STATE_RUNNING, SOURCE_SCRAPE_STATE_COMPLETED, SOURCE_SCRAPE_STATE_ERROR } from '../../../reducers/sources/sources/selected/sourceDetails';
import { InfoNotice, ErrorNotice, WarningNotice } from '../../common/Notice';
import { jobStatusDateToMoment } from '../../../lib/dateUtil';
import AppButton from '../../common/AppButton';

const localMessages = {
  searchNow: { id: 'source.basicInfo.searchNow', defaultMessage: 'Search on the Dashboard' },
  sourceDetailsTitle: { id: 'source.details.title', defaultMessage: 'Media Source: {name}' },
  sourceDetailsCollectionsTitle: { id: 'source.details.collections.title', defaultMessage: 'Collections' },
  sourceDetailsCollectionsIntro: { id: 'source.details.collections.intro',
    defaultMessage: 'The {name} media source is in {count, plural,\n =0 {no collections}\n =1 {one collection}\n other {# collections}\n}.',
  },
  favoritedCollectionsTitle: { id: 'source.details.collections.favorited.title', defaultMessage: 'Favorited Collections' },
  favoritedCollectionsIntro: { id: 'source.details.collections.favorited.intro',
    defaultMessage: 'You have favorited {count, plural,\n =0 {no collections}\n =1 {one collection}\n other {# collections}\n}.',
  },
  feedInfo: { id: 'source.basicInfo.feeds',
    defaultMessage: 'The content is being pulled from {feedCount, plural,\n =0 {no RSS feeds}\n =1 {one RSS feed}\n =100 {over 100 RSS feeds}\n other {# RSS feeds}}. {feedListLink}.' },
  feedLastScrapeDate: { id: 'source.basicInfo.feed.lastScrape', defaultMessage: ' (Last scraped on {date}) ' },
  feedLink: { id: 'source.basicInfo.feedLink', defaultMessage: 'See all feeds' },
  dateInfo: { id: 'source.basicInfo.dates', defaultMessage: 'We have collected sentences between {startDate} and {endDate}.' },
  contentInfo: { id: 'source.basicInfo.content', defaultMessage: 'Averaging {storyCount} stories per day and {sentenceCount} sentences in the last week.' },
  gapInfo: { id: 'source.basicInfo.gaps', defaultMessage: 'We\'d guess there are {gapCount} "gaps" in our coverage (highlighted in <b><span class="health-gap">in red</span></b> on the chart).  Gaps are when we were unable to collect as much content as we expected too, which means we might be missing some content for those dates.' },
  metadataLabel: { id: 'source.basicInfo.metadata', defaultMessage: 'Metadata' },
  metadataDescription: { id: 'source.basicInfo.metadataDescription', defaultMessage: '{label}' },
  metadataEmpty: { id: 'source.basicInfo.metadata.empty', defaultMessage: 'No metadata available at this time' },
  unknown: { id: 'source.basicInfo.health.unknown', defaultMessage: '(unknown)' },
  isMonitored: { id: 'source.basicInfo.isMonitored', defaultMessage: 'monitored to ensure health' },
  publicNotes: { id: 'source.basicInfo.publicNotes', defaultMessage: '<p><b>Notes</b>: {notes}</p>' },
  editorNotes: { id: 'source.basicInfo.editorNotes', defaultMessage: '<p><b>Editor\'s Notes</b>: {notes}</p>' },
  scraping: { id: 'source.scrape.scraping', defaultMessage: 'We are current trying to scrape this source to discover RSS feeds we can pull content from.' },
  scrapeFailed: { id: 'source.scrape.failed', defaultMessage: 'Our last attempt to scrape this source for RSS feeds failed.' },
  unhealthySource: { id: 'source.warning.unhealthy', defaultMessage: 'It looks like we aren\'t actively tracking this source. Don\'t use it in general queries.' },
};

class SourceDetailsContainer extends React.Component {

  searchOnDashboard = () => {
    const { source } = this.props;
    let dashboardUrl = `https://dashboard.mediacloud.org/#query/["*"]/[{"sources":[${source.media_id}]}]/`;
    if (source.health) {
      dashboardUrl += `["${source.health.start_date.substring(0, 10)}"]/["${source.health.end_date.substring(0, 10)}"]/`;
    } else {
      dashboardUrl += '[""]/[""]/';
    }
    dashboardUrl += `[{"uid":3,"name":"${source.name}","color":"55868A"}]`;
    window.open(dashboardUrl, '_blank');
  }

  render() {
    const { source } = this.props;
    const { formatMessage, formatNumber, formatDate } = this.props.intl;
    const collections = source.media_source_tags.filter(c => (isCollectionTagSet(c.tag_sets_id) && c.show_on_media === 1));
    const metadata = source.media_source_tags.filter(c => (isMetaDataTagSet(c.tag_sets_id)));
    const filename = `SentencesOverTime-Source-${source.media_id}`;
    // check if source is not suitable for general queries
    let unhealthySourceWarning;
    if (source.media_source_tags[0].tags_id === 8875452 && !isCollectionTagSet(source.media_source_tags[0].tags_id) && !source.is_healthy) {
      unhealthySourceWarning = (<WarningNotice><FormattedMessage {...localMessages.unhealthySource} /></WarningNotice>);
    }
    let notice;
    // pull together any relevant warnings
    if ((source.latestScrapeState === SOURCE_SCRAPE_STATE_QUEUED) || (source.latestScrapeState === SOURCE_SCRAPE_STATE_RUNNING)) {
      notice = (<InfoNotice><FormattedMessage {...localMessages.scraping} /></InfoNotice>);
    } else if (source.latestScrapeState === SOURCE_SCRAPE_STATE_ERROR) {
      notice = (<ErrorNotice><FormattedMessage {...localMessages.scrapeFailed} /></ErrorNotice>);
    }
    // show them the last feed scrape date, if there was a successfull one
    let feedScrapeMsg;
    if (source.latestScrapeState === SOURCE_SCRAPE_STATE_COMPLETED) {
      feedScrapeMsg = (
        <FormattedMessage
          {...localMessages.feedLastScrapeDate}
          values={{ date: formatDate(jobStatusDateToMoment(source.scrape_status.job_states[0].last_updated)) }}
        />
      );
    }
    // gather up metadata nicely
    let metadataContent = <FormattedMessage {...localMessages.metadataEmpty} />;
    if (metadata.length > 0) {
      metadataContent = (
        <ul>{ metadata.map(item =>
          <li key={`metadata-${item.label}`}>
            <FormattedMessage {...localMessages.metadataDescription} values={{ label: item.description ? item.description : item.label }} />
          </li>
          )}
        </ul>
      );
    }
    const publicNotes = (source.public_notes) ? <FormattedHTMLMessage {...localMessages.publicNotes} values={{ notes: source.public_notes }} /> : null;
    const editorNotes = (source.editor_notes) ? <FormattedHTMLMessage {...localMessages.editorNotes} values={{ notes: source.editor_notes }} /> : null;
    return (
      <Grid className="details source-details">
        <Row>
          <Col lg={10} xs={12}>
            {notice}
            {unhealthySourceWarning} <br />
            {publicNotes}
            <Permissioned onlyRole={PERMISSION_MEDIA_EDIT}>
              {editorNotes}
            </Permissioned>
            <p>
              <FormattedMessage
                {...localMessages.dateInfo}
                values={{
                  startDate: (source.health) ? source.health.start_date.substring(0, 10) : formatMessage(localMessages.unknown),
                  endDate: (source.health) ? source.health.end_date.substring(0, 10) : formatMessage(localMessages.unknown),
                }}
              />
              &nbsp;
              <FormattedMessage
                {...localMessages.contentInfo}
                values={{
                  storyCount: (source.health) ? formatNumber(source.health.num_stories_w) : formatMessage(localMessages.unknown),
                  sentenceCount: (source.health) ? formatNumber(source.health.num_sentences_w) : formatMessage(localMessages.unknown),
                }}
              />
              &nbsp;
              <FormattedHTMLMessage
                {...localMessages.gapInfo}
                values={{ gapCount: (source.health) ? formatNumber(source.health.coverage_gaps) : formatMessage(localMessages.unknown) }}
              />
              &nbsp;
              <FormattedMessage
                {...localMessages.feedInfo}
                values={{
                  feedCount: source.feedCount,
                  feedListLink: (
                    <Link to={`/sources/${source.media_id}/feeds`} >
                      <FormattedMessage {...localMessages.feedLink} />
                    </Link>
                  ),
                }}
              />
              {feedScrapeMsg}
            </p>
            <p>
              <a href={source.url}> {source.url} </a>
            </p>
            <AppButton label={formatMessage(localMessages.searchNow)} primary onClick={this.searchOnDashboard} />
          </Col>
          <Col lg={2} xs={12}>
            <HealthBadge isHealthy={(source.health) ? source.health.is_healthy === 1 : true} />
          </Col>
        </Row>
        <Row>
          <Col lg={6} xs={12}>
            <SourceTopWordsContainer source={source} />
          </Col>
          <Col lg={6} xs={12}>
            <SourceSentenceCountContainer sourceId={source.media_id} filename={filename} />
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <SourceGeographyContainer source={source} />
          </Col>
        </Row>
        <Row>
          <Col lg={6} md={6} sm={12}>
            <CollectionList
              title={formatMessage(localMessages.sourceDetailsCollectionsTitle)}
              intro={formatMessage(localMessages.sourceDetailsCollectionsIntro, {
                name: source.name,
                count: collections.length,
              })}
              collections={collections}
            />
          </Col>
          <Col lg={6} md={6} sm={12} >
            <DataCard>
              <h2>
                <FormattedMessage {...localMessages.metadataLabel} />
              </h2>
              {metadataContent}
            </DataCard>
          </Col>
        </Row>
      </Grid>
    );
  }

}

SourceDetailsContainer.propTypes = {
  intl: React.PropTypes.object.isRequired,
  // from context
  params: React.PropTypes.object.isRequired,       // params from router
  sourceId: React.PropTypes.number.isRequired,
  // from state
  source: React.PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  sourceId: parseInt(ownProps.params.sourceId, 10),
  source: state.sources.sources.selected.sourceDetails,
});

export default
  injectIntl(
    connect(mapStateToProps)(
      SourceDetailsContainer
    )
  );
