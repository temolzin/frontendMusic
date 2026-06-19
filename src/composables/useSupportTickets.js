import { api } from 'boot/axios';

export function useSupportTickets() {

  async function createTicket(payload) {
    const { data } = await api.post('/api/support-tickets', payload);
    return data.data;
  }

  async function uploadEvidence(ticketId, files) {
    const formData = new FormData();
    files.forEach((file) => formData.append('files[]', file));
    const { data } = await api.post(`/api/support-tickets/${ticketId}/evidences`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  }

  async function getMyTickets() {
    const { data } = await api.get('/api/support-tickets/my');
    return data.data;
  }

  async function getAdminTickets(filters = {}) {
    const { data } = await api.get('/api/admin/support-tickets', { params: filters });
    return data.data;
  }

  async function getAdminTicketDetail(id) {
    const { data } = await api.get(`/api/admin/support-tickets/${id}`);
    return data.data;
  }

  async function updateTicketStatus(id, payload) {
    const { data } = await api.patch(`/api/admin/support-tickets/${id}/status`, payload);
    return data.data;
  }

  return {
    createTicket,
    uploadEvidence,
    getMyTickets,
    getAdminTickets,
    getAdminTicketDetail,
    updateTicketStatus,
  };
}
