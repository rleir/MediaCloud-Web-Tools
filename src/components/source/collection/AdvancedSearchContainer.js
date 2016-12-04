import React from 'react';
import Title from 'react-title-component';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import CollectionAdvancedSearchMetadataForm from './form/CollectionAdvancedSearchMetadataForm';
import SourcesAndCollectionsContainer from '../SourcesAndCollectionsContainer';
import { selectAdvancedSearchString, fetchSourceByMetadata, fetchCollectionByMetadata } from '../../../actions/sourceActions';

const localMessages = {
  mainTitle: { id: 'collection.maintitle', defaultMessage: 'Advanced Search' },
  addButton: { id: 'collection.add.save', defaultMessage: 'Search' },
};

class AdvancedSearchContainer extends React.Component {
  componentWillMount() {
    const { location, dispatchAdvancedSearchStringSelected } = this.props;
    if (!location) return;
    const hashParts = location.search.split('?');
    const searchString = hashParts[1];
    // how to get this from here into initialValues? state or store
    dispatchAdvancedSearchStringSelected(searchString);
  }
  render() {
    const { searchString, queriedSources, queriedCollections, requerySourcesAndCollections } = this.props;
    const { formatMessage } = this.props.intl;
    const titleHandler = parentTitle => `${formatMessage(localMessages.mainTitle)} | ${parentTitle}`;
    let content = null;
    if (searchString) {
      content = (
        <CollectionAdvancedSearchMetadataForm
          initialValues={{ advancedSearchQueryString: searchString }}
          buttonLabel={formatMessage(localMessages.addButton)}
          requerySourcesAndCollections={requerySourcesAndCollections}
        />
      );
    }
    return (
      <div>
        <Title render={titleHandler} />
        <Grid>
          <Row>
            <Col lg={12}>
              <h1><FormattedMessage {...localMessages.mainTitle} /></h1>
            </Col>
          </Row>
          {content}
          <SourcesAndCollectionsContainer queriedSources={queriedSources} queriedCollections={queriedCollections} />
        </Grid>
      </div>
    );
  }
}

AdvancedSearchContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  fetchStatus: React.PropTypes.string,
  queriedCollections: React.PropTypes.array,
  queriedSources: React.PropTypes.array,
  dispatchAdvancedSearchStringSelected: React.PropTypes.func,
  requerySourcesAndCollections: React.PropTypes.func,
  initialValues: React.PropTypes.array,
  location: React.PropTypes.object,
  // from params
  searchString: React.PropTypes.string,
};

const mapStateToProps = state => ({
  searchString: state.sources.selected.advancedSearchString,
});

const mapDispatchToProps = dispatch => ({
  requerySourcesAndCollections: (values) => {
    const searchString = values.advancedSearchQueryString;
    // once we have the hookup, this naming might change a bit
    dispatch(fetchSourceByMetadata(searchString));
    dispatch(fetchCollectionByMetadata(searchString));
  },
  dispatchAdvancedSearchStringSelected: (searchString) => {
    dispatch(selectAdvancedSearchString(searchString));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      AdvancedSearchContainer
    ),
  );
