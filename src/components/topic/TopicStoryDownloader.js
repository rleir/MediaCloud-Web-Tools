import PropTypes from 'prop-types';
import React from 'react';
import withCsvDownloadNotifyContainer from '../common/hocs/CsvDownloadNotifyContainer';
import StoryDownloadDialog, { FIELD_STORY_COUNT, FIELD_MEDIA_METADATA, FIELD_STORY_TAGS, FIELD_FACEBOOK_DATES,
  FIELD_REDDIT_DATA, FIELD_SORT, FIELD_PLATFORM_URL_SHARES, FIELD_SOCIAL_SHARES } from './StoryDownloadDialog';
import { formatAsUrlParams } from '../util/location';
import { HELP_STORIES_CSV_COLUMNS } from '../../lib/helpConstants';

/**
 * Use this with the JS Composition pattern to make something show a topic story download dialog
 */
function withTopicStoryDownload() {
  return (ChildComponent) => {
    class TopicStoryDownloader extends React.Component {
      state = {
        showDialog: false,
        sort: null,
        showTweetCounts: false,
        onDownload: null,
        usingUrlSharingSubtopic: false,
        hasAUrlSharingFocalSet: false,
      }

      handleDownload = (options) => {
        const { filters, topicId, notifyOfCsvDownload } = this.props;
        const params = {
          ...filters,
          sort: options[FIELD_SORT],
        };
        if (options[FIELD_STORY_COUNT]) {
          params.storyLimit = options.storyCount;
        }
        if (options[FIELD_STORY_TAGS]) {
          params.storyTags = 1;
        }
        if (options[FIELD_MEDIA_METADATA]) {
          params.mediaMetadata = 1;
        }
        if (options[FIELD_REDDIT_DATA]) {
          params.redditData = 1;
        }
        if (options[FIELD_FACEBOOK_DATES]) {
          params.fbData = 1;
        }
        if (options[FIELD_PLATFORM_URL_SHARES]) {
          params.platformUrlShares = 1;
        }
        if (options[FIELD_SOCIAL_SHARES]) {
          params.socialShares = 1;
        }
        const url = `/api/topics/${topicId}/stories.csv?${formatAsUrlParams(params)}`;
        window.location = url;
        this.setState({ showDialog: false });
        notifyOfCsvDownload(HELP_STORIES_CSV_COLUMNS);
      }

      render() {
        return (
          <span className="topic-story-downloader">
            <ChildComponent
              {...this.props}
              showTopicStoryDownloadDialog={(sort, showTweetCounts, onDownload, usingUrlSharingSubtopic, hasAUrlSharingFocalSet) => {
                this.setState({ showDialog: true, usingUrlSharingSubtopic, hasAUrlSharingFocalSet, showTweetCounts, sort, onDownload });
              }}
            />
            {this.state.showDialog && (
              <StoryDownloadDialog
                open={this.state.showDialog}
                onDownload={this.state.onDownload || this.handleDownload}
                onCancel={() => this.setState({ showDialog: false })}
                hasTweetCounts={this.state.showTweetCounts}
                initialValues={{ storyCount: 1000, sort: this.state.sort }}
                usingUrlSharingSubtopic={this.state.usingUrlSharingSubtopic}
                hasAUrlSharingFocalSet={this.state.hasAUrlSharingFocalSet}
              />
            )}
          </span>
        );
      }
    }

    TopicStoryDownloader.propTypes = {
      // from compositional chain
      notifyOfCsvDownload: PropTypes.func.isRequired,
      usingUrlSharingSubtopic: PropTypes.bool,
      // from child
      filters: PropTypes.object.isRequired,
      topicId: PropTypes.number.isRequired,

    };

    return withCsvDownloadNotifyContainer(TopicStoryDownloader);
  };
}

export default withTopicStoryDownload;
