import { api } from "boot/axios";

export const createTicket = async ({ commit }, payload) => {
    const response = await api.post("/api/support-tickets", payload);
    commit("addMyTicket", response.data.data);
    return response.data.data;
};

export const uploadTicketEvidence = async (context, payload) => {
    const formData = new FormData();
    payload.files.forEach((file) => formData.append("files[]", file));
    const response = await api.post(
        `/api/support-tickets/${payload.ticketId}/evidences`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data.data;
};

export const fetchMyTickets = async ({ commit }) => {
    const response = await api.get("/api/support-tickets/my");
    commit("setMyTickets", response.data.data || []);
    return response.data.data;
};

export const fetchMyArtistTickets = async ({ commit }) => {
    const response = await api.get("/api/support-tickets/my/artist");
    commit("setArtistTickets", response.data.data || []);
    return response.data.data;
};

export const fetchMyCustomerTickets = async ({ commit }) => {
    const response = await api.get("/api/support-tickets/my/customer");
    commit("setCustomerTickets", response.data.data || []);
    return response.data.data;
};

export const fetchAdminTickets = async ({ commit }, filters = {}) => {
    const response = await api.get("/api/admin/support-tickets", { params: filters });
    const result = response.data.data;
    const tickets = result.data || result || [];
    commit("setAdminTickets", tickets);
    return result;
};

export const fetchAdminTicketDetail = async ({ commit }, ticketId) => {
    const response = await api.get(`/api/admin/support-tickets/${ticketId}`);
    commit("setCurrentTicket", response.data.data);
    return response.data.data;
};

export const updateTicketStatus = async ({ commit }, payload) => {
    const response = await api.patch(`/api/admin/support-tickets/${payload.ticketId}/status`, {
        status: payload.status,
        resolution_type: payload.resolution_type,
    });
    commit("setCurrentTicket", response.data.data);
    return response.data.data;
};

export const fetchTicketLogs = async (context, ticketId) => {
    const response = await api.get(`/api/admin/support-tickets/${ticketId}/logs`);
    return response.data.data;
};

export const fetchMyTicketLogs = async (context, ticketId) => {
    const response = await api.get(`/api/support-tickets/${ticketId}/logs`);
    return response.data.data;
};

export const addTicketComment = async (context, { ticketId, message, isAdmin }) => {
    const url = isAdmin
        ? `/api/admin/support-tickets/${ticketId}/comment`
        : `/api/support-tickets/${ticketId}/comment`;
    const response = await api.post(url, { message });
    return response.data.data;
};
