export const setPendingApprovals = (state, sales) => {
  state.pendingApprovals = sales;
};

export const setApprovalHistory = (state, sales) => {
  state.approvalHistory = sales;
};

export const removeApproval = (state, saleId) => {
  state.pendingApprovals = state.pendingApprovals.filter((s) => s.id !== saleId);
};

export const decrementCountdowns = (state) => {
  state.pendingApprovals.forEach((sale) => {
    if (sale.time_remaining_seconds > 0) {
      sale.time_remaining_seconds -= 1;
    }
  });
};
