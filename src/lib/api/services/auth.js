import { apiClient } from '../client';

export class AuthService {
  async login(credentials) {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  }

  async register(userData) {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  }

  async logout() {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  }

  async refreshToken(refreshToken) {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
  }

  async getProfile() {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  }

  async updateProfile(data) {
    const response = await apiClient.put('/auth/profile', data);
    return response.data;
  }

  async changePassword(data) {
    const response = await apiClient.put('/auth/change-password', data);
    return response.data;
  }
}

export const authService = new AuthService();