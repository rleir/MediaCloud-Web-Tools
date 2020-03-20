import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import Permissioned from '../../common/Permissioned';
import { PERMISSION_TOPIC_WRITE } from '../../../lib/auth';
import { WarningNotice } from '../../common/Notice';
import AppButton from '../../common/AppButton';
import LinkWithFilters from '../LinkWithFilters';

const localMessages = {
  platformIncomplete: { id: 'topic.incomplete', defaultMessage: 'Your topic is still new. Add some platforms and then you can run it.' },
  platformIncompleteAction: { id: 'topic.incomplete.action', defaultMessage: 'Manage Platforms' },
};

export function platformIncomplete(initializedPlatform) {
  return !initializedPlatform;
}

/**
 * For new topics we can use this to show the user that they need to add some platforms.
 */
const IncompletePlatformWarning = ({ initializedPlatform, topicId }) => (
  <Permissioned onlyTopic={PERMISSION_TOPIC_WRITE}>
    {platformIncomplete(initializedPlatform) && (
      <div className="notice warning-background">
        <Grid>
          <Row>
            <Col lg={12}>
              <WarningNotice>
                <FormattedMessage {...localMessages.platformIncomplete} />
                {window.location.href.indexOf('platforms') === -1 && (
                  <LinkWithFilters to={`/topics/${topicId}/platforms/manage`}>
                    <AppButton label={localMessages.platformIncompleteAction} />
                  </LinkWithFilters>
                )}
              </WarningNotice>
            </Col>
          </Row>
        </Grid>
      </div>
    )}
  </Permissioned>
);

IncompletePlatformWarning.propTypes = {
  // from state
  initializedPlatform: PropTypes.bool.isRequired,
  topicId: PropTypes.number.isRequired,
  // from compositional chain
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  topicId: state.topics.selected.id,
  initializedPlatform: state.topics.selected.platforms.all.initialized,
});

export default
injectIntl(
  connect(mapStateToProps)(
    IncompletePlatformWarning
  )
);
