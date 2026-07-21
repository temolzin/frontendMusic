export const setPendingRequests = (state, requests) => {
  state.pendingRequests = requests;
};

export const removeRequest = (state, requestId) => {
  state.pendingRequests = state.pendingRequests.filter((r) => r.id !== requestId);
};
