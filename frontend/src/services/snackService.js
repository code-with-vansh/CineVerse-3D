import api from './api';

export const snackService = {
  async getSnacks(category = null) {
    const url = category && category !== 'ALL' 
      ? `/snacks/category/${category}` 
      : '/snacks';
    const res = await api.get(url);
    return res.data;
  },

  async getSnackById(id) {
    const res = await api.get(`/snacks/${id}`);
    return res.data;
  },
};

export default snackService;
