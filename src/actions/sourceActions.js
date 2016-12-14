import { createAction } from 'redux-actions';
import { createAsyncAction } from '../lib/reduxHelpers';
import * as api from '../lib/sources';

// export const FETCH_SOURCE_LIST = 'FETCH_SOURCE_LIST';
export const FETCH_SOURCE_LIST = 'FETCH_SOURCE_LIST';
export const FETCH_COLLECTION_LIST = 'FETCH_COLLECTION_LIST';
export const FETCH_SOURCES_BY_IDS = 'FETCH_SOURCES_BY_IDS';
export const RESET_SOURCES_BY_IDS = 'RESET_SOURCES_BY_IDS';
export const FETCH_COLLECTION_SOURCES_BY_IDS = 'FETCH_COLLECTION_SOURCES_BY_IDS';
export const RESET_COLLECTIONS_BY_IDS = 'RESET_COLLECTIONS_BY_IDS';
export const FETCH_SOURCE_DETAILS = 'FETCH_SOURCE_DETAILS';
export const FETCH_COLLECTION_DETAILS = 'FETCH_COLLECTION_DETAILS';
export const SELECT = 'SELECT';
export const SOURCE_FILTER_BY_SNAPSHOT = 'SOURCE_FILTER_BY_SNAPSHOT';
export const SOURCE_FILTER_BY_TIMESPAN = 'SOURCE_FILTER_BY_TIMESPAN';
export const FETCH_SOURCE_SUMMARY = 'FETCH_SOURCE_SUMMARY';
export const SORT_SOURCE_DETAILS = 'SORT_SOURCE_DETAILS';
export const SORT_COLLECTION_DETAILS = 'SORT_COLLECTION_DETAILS';
export const FETCH_SOURCE_TOP_WORDS = 'FETCH_SOURCE_TOP_WORDS';
export const FETCH_COLLECTION_TOP_WORDS = 'FETCH_COLLECTION_TOP_WORDS';
export const FETCH_SOURCE_SNAPSHOTS_LIST = 'FETCH_SOURCE_SNAPSHOTS_LIST';
export const FETCH_SOURCE_TIMESPANS_LIST = 'FETCH_SOURCE_TIMESPANS_LIST';
export const FETCH_SOURCE_SENTENCE_COUNT = 'FETCH_SOURCE_SENTENCE_COUNT';
export const FETCH_COLLECTION_SENTENCE_COUNT = 'FETCH_COLLECTION_SENTENCE_COUNT';
export const FETCH_SOURCE_GEO = 'FETCH_SOURCE_GEO';
export const FETCH_COLLECTION_GEO = 'FETCH_COLLECTION_GEO';
export const FETCH_SOURCE_SEARCH = 'FETCH_SOURCE_SEARCH';
export const RESET_SOURCE_SEARCH = 'RESET_SOURCE_SEARCH';
export const FETCH_COLLECTION_SEARCH = 'FETCH_COLLECTION_SEARCH';
export const RESET_COLLECTION_SEARCH = 'RESET_COLLECTION_SEARCH';
export const FETCH_COLLECTION_SOURCE_SENTENCE_COUNTS = 'FETCH_COLLECTION_SOURCE_SENTENCE_COUNTS';
export const CREATE_NEW_COLLECTION = 'CREATE_NEW_COLLECTION';
export const UPDATE_COLLECTION = 'UPDATE_COLLECTION';
export const CREATE_NEW_SOURCE = 'CREATE_NEW_SOURCE';
export const UPDATE_SOURCE = 'UPDATE_SOURCE';
export const FETCH_METADATA_VALUES = 'FETCH_METADATA_VALUES';
export const FETCH_COLLECTION_TO_COPY = 'FETCH_COLLECTION_TO_COPY';
export const FETCH_SOURCE_BY_METADATA = 'FETCH_SOURCE_BY_METADATA';
export const FETCH_COLLECTION_BY_METADATA = 'FETCH_COLLECTION_BY_METADATA';
export const SELECT_ADVANCED_SEARCH_SOURCE = 'SELECT_ADVANCED_SEARCH_SOURCE';
export const SELECT_ADVANCED_SEARCH_COLLECTION = 'SELECT_ADVANCED_SEARCH_COLLECTION';
export const SELECT_ADVANCED_SEARCH_STRING = 'SELECT_ADVANCED_SEARCH_STRING';
export const RESET_ADVANCED_SEARCH_COLLECTION = 'RESET_ADVANCED_SEARCH_COLLECTION';
export const RESET_ADVANCED_SEARCH_SOURCE = 'RESET_ADVANCED_SEARCH_SOURCE';
export const FETCH_SOURCE_FEEDS = 'FETCH_SOURCE_FEEDS';
export const SUGGEST_SOURCE = 'SUGGEST_SOURCE';

export const select = createAction(SELECT, id => id);

export const fetchSourceList = createAsyncAction(FETCH_SOURCE_LIST, api.sourceList);

export const fetchCollectionList = createAsyncAction(FETCH_COLLECTION_LIST, api.collectionList, id => id);

export const fetchSourcesByIds = createAsyncAction(FETCH_SOURCES_BY_IDS, api.sourcesByIds, props => props);

export const resetSourcesByIds = createAction(RESET_SOURCES_BY_IDS);

export const fetchCollectionSourcesByIds = createAsyncAction(FETCH_COLLECTION_SOURCES_BY_IDS, api.collectionsByIds, props => props);

export const resetCollectionsByIds = createAction(RESET_COLLECTIONS_BY_IDS);

export const fetchSourceDetails = createAsyncAction(FETCH_SOURCE_DETAILS, api.sourceDetails, id => id);

export const fetchCollectionDetails = createAsyncAction(FETCH_COLLECTION_DETAILS, api.collectionDetails, id => id);

export const fetchCollectionToCopy = createAsyncAction(FETCH_COLLECTION_TO_COPY, api.collectionDetails, id => id);

export const fetchSourceSentenceCount = createAsyncAction(FETCH_SOURCE_SENTENCE_COUNT, api.sourceSentenceCount, id => id);

export const fetchCollectionSentenceCount = createAsyncAction(FETCH_COLLECTION_SENTENCE_COUNT, api.collectionSentenceCount, id => id);

export const fetchSourceTopWords = createAsyncAction(FETCH_SOURCE_TOP_WORDS, api.sourceWordCount, id => id);

export const fetchCollectionTopWords = createAsyncAction(FETCH_COLLECTION_TOP_WORDS, api.collectionWordCount, id => id);

export const fetchSourceGeo = createAsyncAction(FETCH_SOURCE_GEO, api.sourceGeography, id => id);

export const fetchCollectionGeo = createAsyncAction(FETCH_COLLECTION_GEO, api.collectionGeography, id => id);

export const fetchSourceSearch = createAsyncAction(FETCH_SOURCE_SEARCH, api.sourceSearch, string => string);

export const resetSourceSearch = createAction(RESET_SOURCE_SEARCH);

export const fetchCollectionSearch = createAsyncAction(FETCH_COLLECTION_SEARCH, api.collectionSearch, string => string);

export const resetCollectionSearch = createAction(RESET_COLLECTION_SEARCH);

export const fetchCollectionSourceSentenceCounts = createAsyncAction(FETCH_COLLECTION_SOURCE_SENTENCE_COUNTS, api.collectionSourceStoryCounts, id => id);

export const createCollection = createAsyncAction(CREATE_NEW_COLLECTION, api.createCollection, props => props);

export const updateCollection = createAsyncAction(UPDATE_COLLECTION, api.updateCollection, props => props);

export const createSource = createAsyncAction(CREATE_NEW_SOURCE, api.createSource, props => props);

export const updateSource = createAsyncAction(UPDATE_SOURCE, api.updateSource, props => props);

export const fetchMetadataValues = createAsyncAction(FETCH_METADATA_VALUES, api.metadataValues);

export const fetchSourceByMetadata = createAsyncAction(FETCH_SOURCE_BY_METADATA, api.sourceSearch, string => string);

export const fetchCollectionByMetadata = createAsyncAction(FETCH_COLLECTION_BY_METADATA, api.collectionSearch, string => string);

export const selectAdvancedSearchSource = createAction(SELECT_ADVANCED_SEARCH_SOURCE, payload => payload);

export const selectAdvancedSearchCollection = createAction(SELECT_ADVANCED_SEARCH_COLLECTION, payload => payload);

export const selectAdvancedSearchString = createAction(SELECT_ADVANCED_SEARCH_STRING, string => string);

export const resetAdvancedSearchSource = createAction(RESET_ADVANCED_SEARCH_SOURCE);

export const resetAdvancedSearchCollection = createAction(RESET_ADVANCED_SEARCH_COLLECTION);

export const fetchSourceFeeds = createAsyncAction(FETCH_SOURCE_FEEDS, api.sourceFeeds, id => id);

export const suggestSource = createAsyncAction(SUGGEST_SOURCE, api.suggestSource, props => props);

