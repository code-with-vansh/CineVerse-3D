import api from './api';

export const paymentService = {
  async initiatePayment({ bookingReference, bookingId, paymentMethod }) {
    const res = await api.post('/payments/initiate', {
      bookingReference,
      bookingId,
      paymentMethod,
    });
    return res.data;
  },

  async simulatePaymentResult(paymentId, outcome, paymentMethod) {
    const res = await api.post(`/payments/${paymentId}/simulate-result`, {
      outcome,
      paymentMethod,
    });
    return res;
  },

  async getPayment(paymentId) {
    const res = await api.get(`/payments/${paymentId}`);
    return res.data?.payment;
  },
};

export default paymentService;
