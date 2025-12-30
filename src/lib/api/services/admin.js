import { BaseApiService } from './base';
import { apiClient } from '../client';

// Projects Service
export class ProjectsService extends BaseApiService {
  constructor() {
    super('/projects');
  }

  async uploadImages(id, files) {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    const response = await apiClient.post(`${this.endpoint}/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
}

// Events Service
export class EventsService extends BaseApiService {
  constructor() {
    super('/events');
  }

  async uploadCertificate(id, file) {
    const formData = new FormData();
    formData.append('certificate', file);
    const response = await apiClient.post(`${this.endpoint}/${id}/certificate`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async uploadFiles(id, files) {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    const response = await apiClient.post(`${this.endpoint}/${id}/files`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
}

// Club Members Service
export class ClubMembersService extends BaseApiService {
  constructor() {
    super('/clubMembers');
  }
}

// Core Members Service
export class CoreMembersService extends BaseApiService {
  constructor() {
    super('/coreMembers');
  }
}

// Question Banks Service
export class QuestionBanksService extends BaseApiService {
  constructor() {
    super('/questionBanks');
  }
}

// Textbooks Service
export class TextbooksService extends BaseApiService {
  constructor() {
    super('/textBooks');
  }
}

// NPTEL Lectures Service
export class NptelLecturesService extends BaseApiService {
  constructor() {
    super('/nptelLectures');
  }
}

// Placement Prep Service
export class PlacementPrepService extends BaseApiService {
  constructor() {
    super('/placementPrep');
  }
}

// VLSI Materials Service
export class VlsiMaterialsService extends BaseApiService {
  constructor() {
    super('/vlsiMaterials');
  }
}

// GATE PYQs Service
export class GatePyqsService extends BaseApiService {
  constructor() {
    super('/gatePyqs');
  }
}

// Magazines Service
export class MagazinesService extends BaseApiService {
  constructor() {
    super('/magazines');
  }
}

// Tests Service
export class TestsService extends BaseApiService {
  constructor() {
    super('/tests');
  }
}

// Notifications Service
export class NotificationsService extends BaseApiService {
  constructor() {
    super('/notifications');
  }
}

// Running Notifications Service
export class RunningNotificationsService extends BaseApiService {
  constructor() {
    super('/runningNotifications');
  }
}

// Team Photos Service
export class TeamPhotosService extends BaseApiService {
  constructor() {
    super('/teamPhotos');
  }
}

// Upload Service
export class UploadService {
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    const response = await apiClient.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/upload/file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async deleteFile(id) {
    const response = await apiClient.delete(`/upload/${id}`);
    return response.data;
  }
}

// Export service instances
export const projectsService = new ProjectsService();
export const eventsService = new EventsService();
export const clubMembersService = new ClubMembersService();
export const coreMembersService = new CoreMembersService();
export const questionBanksService = new QuestionBanksService();
export const textbooksService = new TextbooksService();
export const nptelLecturesService = new NptelLecturesService();
export const placementPrepService = new PlacementPrepService();
export const vlsiMaterialsService = new VlsiMaterialsService();
export const gatePyqsService = new GatePyqsService();
export const magazinesService = new MagazinesService();
export const testsService = new TestsService();
export const notificationsService = new NotificationsService();
export const runningNotificationsService = new RunningNotificationsService();
export const teamPhotosService = new TeamPhotosService();
export const uploadService = new UploadService();