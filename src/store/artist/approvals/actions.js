import { api } from "boot/axios";

export const fetchPendingApprovals = async ({ commit }) => {
  const { data } = await api.get("/api/artist/approval/pending");
  commit("setPendingApprovals", data.sales || []);
};

export const fetchApprovalHistory = async ({ commit }) => {
  const { data } = await api.get("/api/artist/approval/history");
  commit("setApprovalHistory", data.sales || []);
};

export const acceptApproval = async ({ commit }, saleId) => {
  const { data } = await api.put(`/api/artist/approval/${saleId}/accept`);
  commit("removeApproval", saleId);
  return data;
};

export const rejectApproval = async ({ commit }, saleId) => {
  const { data } = await api.put(`/api/artist/approval/${saleId}/reject`);
  commit("removeApproval", saleId);
  return data;
};
