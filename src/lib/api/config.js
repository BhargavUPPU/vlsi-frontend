/**
 * API Client Configuration
 * Base URL will be set via environment variables
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  
  // Users
  USERS: {
    BASE: '/users',
    BY_ID: (id) => `/users/${id}`,
  },
  
  // Club Members
  CLUB_MEMBERS: {
    BASE: '/clubMembers',
    BY_ID: (id) => `/clubMembers/${id}`,
  },
  
  // Core Members
  CORE_MEMBERS: {
    BASE: '/coreMembers',
    BY_ID: (id) => `/coreMembers/${id}`,
  },
  
  // Projects
  PROJECTS: {
    BASE: '/projects',
    GET_ALL: '/projects',
    BY_ID: (id) => `/projects/${id}`,
    IMAGES: (id) => `/projects/${id}/images`,
  },
  
  // Events
  EVENTS: {
    BASE: '/events',
    GET_ALL: '/events',
    BY_ID: (id) => `/events/${id}`,
    CERTIFICATE: (id) => `/events/${id}/certificate`,
    FILES: (id) => `/events/${id}/files`,
  },
  
  // Resources
  QUESTION_BANKS: {
    BASE: '/questionBanks',
    BY_ID: (id) => `/questionBanks/${id}`,
  },
  
  TEXTBOOKS: {
    BASE: '/textBooks',
    BY_ID: (id) => `/textBooks/${id}`,
  },
  
  NPTEL_LECTURES: {
    BASE: '/nptelLectures',
    BY_ID: (id) => `/nptelLectures/${id}`,
  },
  
  PLACEMENT_PREP: {
    BASE: '/placementPrep',
    BY_ID: (id) => `/placementPrep/${id}`,
  },
  
  VLSI_MATERIALS: {
    BASE: '/vlsiMaterials',
    BY_ID: (id) => `/vlsiMaterials/${id}`,
  },
  
  GATE_PYQS: {
    BASE: '/gatePyqs',
    BY_ID: (id) => `/gatePyqs/${id}`,
  },
  
  MAGAZINES: {
    BASE: '/magazines',
    BY_ID: (id) => `/magazines/${id}`,
  },
  
  // Tests
  TESTS: {
    BASE: '/tests',
    BY_ID: (id) => `/tests/${id}`,
  },
  
  // Notifications
  NOTIFICATIONS: {
    BASE: '/notifications',
    BY_ID: (id) => `/notifications/${id}`,
  },
  
  RUNNING_NOTIFICATIONS: {
    BASE: '/runningNotifications',
    GET_ALL: '/runningNotifications',
    BY_ID: (id) => `/runningNotifications/${id}`,
  },
  
  // Team Photos
  TEAM_PHOTOS: {
    BASE: '/teamPhotos',
    BY_ID: (id) => `/teamPhotos/${id}`,
  },
  
  // Photo Gallery
  PHOTO_GALLERY: {
    BASE: '/photoGallery',
    BY_ID: (id) => `/photoGallery/${id}`,
    BY_CATEGORY: (category) => `/photoGallery?category=${category}`,
    IMAGES: (id) => `/photoGallery/${id}/images`,
    TOGGLE_ACTIVE: (id) => `/photoGallery/${id}/toggle-active`,
  },
  
  // Milestones
  MILESTONES: {
    BASE: '/milestones',
    BY_ID: (id) => `/milestones/${id}`,
    IMAGE: (id) => `/milestones/${id}/image`,
    YEARS: '/milestones/years',
    CATEGORIES: '/milestones/categories',
    TOGGLE_ACTIVE: (id) => `/milestones/${id}/toggle-active`,
    UPDATE_PRIORITY: (id) => `/milestones/${id}/priority`,
  },
  
  // File Upload
  UPLOAD: {
    IMAGE: '/upload/image',
    FILE: '/upload/file',
    BY_ID: (id) => `/upload/${id}`,
  },
};

export { API_BASE_URL };
