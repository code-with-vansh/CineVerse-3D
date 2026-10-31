import api from './api';

export const ticketService = {
  async verifyTicket(ticketCode) {
    const res = await api.get(`/tickets/${ticketCode}`);
    return res.data;
  },
};

export default ticketService;
