export const setPayoutData = (state, data) => {
  state.payoutData = data || { account_holder: "", bank_name: "", clabe: "", rfc: "" };
};
