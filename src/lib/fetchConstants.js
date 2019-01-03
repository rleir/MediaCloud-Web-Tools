
export const FETCH_INVALID = 'FETCH_INVALID';
export const FETCH_ONGOING = 'FETCH_ONGOING';
export const FETCH_SUCCEEDED = 'FETCH_SUCCEEDED';
export const FETCH_FAILED = 'FETCH_FAILED';

const missingFetchStatusError = {
  msg: 'fetchStatuses is undefined!',
};

export const combineFetchStatuses = (fetchStatuses) => {
  if (fetchStatuses === undefined) {
    throw missingFetchStatusError;
  }
  const removeEmpties = fetchStatuses.filter(f => f !== undefined, true);
  const allInvalid = removeEmpties.reduce((total, status) => total && (status === FETCH_INVALID), true);
  const anyOngoing = removeEmpties.reduce((total, status) => total || (status === FETCH_ONGOING), false);
  const anyFailed = removeEmpties.reduce((total, status) => total || (status === FETCH_FAILED), false);
  const allSucceeded = removeEmpties.reduce((total, status) => total && (status === FETCH_SUCCEEDED), true);
  if (allInvalid) {
    return FETCH_INVALID;
  }
  if (anyOngoing) {
    return FETCH_ONGOING;
  }
  if (anyFailed) {
    return FETCH_FAILED;
  }
  if (allSucceeded) {
    return FETCH_SUCCEEDED;
  }
  return FETCH_ONGOING;
};
