import { apiClient } from '../client';

/**
 * Base API service class providing common CRUD operations
 */
export class BaseApiService {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  async getAll(params = {}) {
    const response = await apiClient.get(this.endpoint, { params });
    return response.data;
  }

  async getById(id) {
    const response = await apiClient.get(`${this.endpoint}/${id}`);
    return response.data;
  }

  async create(data) {
    const config = {};
    // If data is FormData, let browser set Content-Type with boundary
    if (data instanceof FormData) {
      config.headers = { 'Content-Type': 'multipart/form-data' };
    }
    const response = await apiClient.post(this.endpoint, data, config);
    return response.data;
  }

  async update(id, data) {
    const config = {};
    // If data is FormData, let browser set Content-Type with boundary
    if (data instanceof FormData) {
      config.headers = { 'Content-Type': 'multipart/form-data' };
    }
    const response = await apiClient.put(`${this.endpoint}/${id}`, data, config);
    return response.data;
  }

  async delete(id) {
    const response = await apiClient.delete(`${this.endpoint}/${id}`);
    return response.data;
  }

  async bulkDelete(ids) {
    const response = await apiClient.delete(`${this.endpoint}/bulk`, { data: { ids } });
    return response.data;
  }
}