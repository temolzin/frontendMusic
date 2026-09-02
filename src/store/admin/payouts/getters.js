export function statePendingPayouts(state) {
  return state.pendingPayouts;
}

export function getPendingPayoutsCount(state) {
  return state.pendingPayouts.length;
}
