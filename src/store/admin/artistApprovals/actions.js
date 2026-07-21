import { api } from "boot/axios";

export const fetchPendingRequests = async ({ commit }) => {
  const { data } = await api.get("/api/admin/artist-approvals/pending");
  commit("setPendingRequests", data.requests || []);
};

export const acceptRequest = async ({ commit }, requestId) => {
  const { data } = await api.put(`/api/admin/artist-approvals/${requestId}/accept`);
  commit("removeRequest", requestId);
  return data;
};

export const rejectRequest = async ({ commit }, { requestId, rejection_reason }) => {
  const { data } = await api.put(`/api/admin/artist-approvals/${requestId}/reject`, { rejection_reason });
  commit("removeRequest", requestId);
  return data;
};
