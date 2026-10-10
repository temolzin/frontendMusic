export function stateRefunds(state) {
  return state.refunds;
}

export function statePendingRefunds(state) {
  return state.pendingRefunds;
}

export function getPendingRefundsCount(state) {
  return state.pendingRefunds.length;
}
