import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import DataCard from '../../common/DataCard';
import StoryTable from '../../common/StoryTable';
import OrderedWordCloud from '../../vis/OrderedWordCloud';

const localMessages = {
  attention: { id: 'explorer.results.attention.title', defaultMessage: 'Attention' },
  language: { id: 'explorer.results.language.title', defaultMessage: 'Language' },
  people: { id: 'explorer.results.people.title', defaultMessage: 'People & Places' },
};

const QueryAttentionOverTimeDrillDownDataCard = (props) => {
  const { stories, words, info } = props;
  const date = info.date;
  return (
    <DataCard>
      <Row>
        <FormattedMessage {...localMessages.details} values={{ date }} />
        <Col lg={6}>
          <h3><FormattedMessage {...localMessages.sampleStories} values={{ date }} /></h3>
          <StoryTable sources={stories} />
        </Col>
        <Col lg={6}>
          <h3><FormattedMessage {...localMessages.topWords} values={{ date }} /></h3>
          <OrderedWordCloud words={words} />
        </Col>
      </Row>
    </DataCard>
  );
};

QueryAttentionOverTimeDrillDownDataCard.propTypes = {
  // from parent
  stories: PropTypes.object,
  words: PropTypes.array,
  info: PropTypes.string,
  // from compositional chain
  intl: PropTypes.object.isRequired,
};

export default
  injectIntl(
    QueryAttentionOverTimeDrillDownDataCard
  );
