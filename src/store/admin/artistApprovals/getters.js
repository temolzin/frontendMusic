export function getPendingRequests(state) {
  return state.pendingRequests;
}

export function getPendingRequestsCount(state) {
  return state.pendingRequests.length;
}

export function getHistory(state) {
  return state.history;
}
