import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  projectsService,
  eventsService,
  clubMembersService,
  coreMembersService,
  questionBanksService,
  textbooksService,
  nptelLecturesService,
  placementPrepService,
  vlsiMaterialsService,
  gatePyqsService,
  magazinesService,
  testsService,
  notificationsService,
  runningNotificationsService,
  teamPhotosService,
  announcementsService,
  achievementsService,
  photoGalleryService,
  uploadService
} from '../api/services';

// Generic hooks for CRUD operations
export const useGetAll = (queryKey, service, options = {}) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: () => service.getAll(options.params),
    staleTime: 5 * 60 * 1000,
    ...options
  });
};

export const useGetById = (queryKey, service, id, options = {}) => {
  return useQuery({
    queryKey: [queryKey, id],
    queryFn: () => service.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options
  });
};

export const useCreate = (queryKey, service, options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => service.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success(options.successMessage || 'Created successfully');
      options.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create');
      options.onError?.(error);
    }
  });
};

export const useUpdate = (queryKey, service, options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => service.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success(options.successMessage || 'Updated successfully');
      options.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update');
      options.onError?.(error);
    }
  });
};

export const useDelete = (queryKey, service, options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => service.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success(options.successMessage || 'Deleted successfully');
      options.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete');
      options.onError?.(error);
    }
  });
};

// Projects hooks
export const useProjects = (options) => useGetAll('projects', projectsService, options);
export const useProject = (id, options) => useGetById('projects', projectsService, id, options);
export const useCreateProject = (options) => useCreate('projects', projectsService, options);
export const useUpdateProject = (options) => useUpdate('projects', projectsService, options);
export const useDeleteProject = (options) => useDelete('projects', projectsService, options);

// Events hooks
export const useEvents = (options) => useGetAll('events', eventsService, options);
export const useEvent = (id, options) => useGetById('events', eventsService, id, options);
export const useCreateEvent = (options) => useCreate('events', eventsService, options);
export const useUpdateEvent = (options) => useUpdate('events', eventsService, options);
export const useDeleteEvent = (options) => useDelete('events', eventsService, options);

// Club Members hooks
export const useClubMembers = (options) => useGetAll('clubMembers', clubMembersService, options);
export const useClubMember = (id, options) => useGetById('clubMembers', clubMembersService, id, options);
export const useCreateClubMember = (options) => useCreate('clubMembers', clubMembersService, options);
export const useUpdateClubMember = (options) => useUpdate('clubMembers', clubMembersService, options);
export const useDeleteClubMember = (options) => useDelete('clubMembers', clubMembersService, options);

// Core Members hooks
export const useCoreMembers = (options) => useGetAll('coreMembers', coreMembersService, options);
export const useCoreMember = (id, options) => useGetById('coreMembers', coreMembersService, id, options);
export const useCreateCoreMember = (options) => useCreate('coreMembers', coreMembersService, options);
export const useUpdateCoreMember = (options) => useUpdate('coreMembers', coreMembersService, options);
export const useDeleteCoreMember = (options) => useDelete('coreMembers', coreMembersService, options);

// Question Banks hooks
export const useQuestionBanks = (options) => useGetAll('questionBanks', questionBanksService, options);
export const useQuestionBank = (id, options) => useGetById('questionBanks', questionBanksService, id, options);
export const useCreateQuestionBank = (options) => useCreate('questionBanks', questionBanksService, options);
export const useUpdateQuestionBank = (options) => useUpdate('questionBanks', questionBanksService, options);
export const useDeleteQuestionBank = (options) => useDelete('questionBanks', questionBanksService, options);

// Textbooks hooks
export const useTextbooks = (options) => useGetAll('textbooks', textbooksService, options);
export const useTextbook = (id, options) => useGetById('textbooks', textbooksService, id, options);
export const useCreateTextbook = (options) => useCreate('textbooks', textbooksService, options);
export const useUpdateTextbook = (options) => useUpdate('textbooks', textbooksService, options);
export const useDeleteTextbook = (options) => useDelete('textbooks', textbooksService, options);

// NPTEL Lectures hooks
export const useNptelLectures = (options) => useGetAll('nptelLectures', nptelLecturesService, options);
export const useNptelLecture = (id, options) => useGetById('nptelLectures', nptelLecturesService, id, options);
export const useCreateNptelLecture = (options) => useCreate('nptelLectures', nptelLecturesService, options);
export const useUpdateNptelLecture = (options) => useUpdate('nptelLectures', nptelLecturesService, options);
export const useDeleteNptelLecture = (options) => useDelete('nptelLectures', nptelLecturesService, options);

// Placement Prep hooks
export const usePlacementPrep = (options) => useGetAll('placementPrep', placementPrepService, options);
export const usePlacementPrepItem = (id, options) => useGetById('placementPrep', placementPrepService, id, options);
export const useCreatePlacementPrep = (options) => useCreate('placementPrep', placementPrepService, options);
export const useUpdatePlacementPrep = (options) => useUpdate('placementPrep', placementPrepService, options);
export const useDeletePlacementPrep = (options) => useDelete('placementPrep', placementPrepService, options);

// VLSI Materials hooks
export const useVlsiMaterials = (options) => useGetAll('vlsiMaterials', vlsiMaterialsService, options);
export const useVlsiMaterial = (id, options) => useGetById('vlsiMaterials', vlsiMaterialsService, id, options);
export const useCreateVlsiMaterial = (options) => useCreate('vlsiMaterials', vlsiMaterialsService, options);
export const useUpdateVlsiMaterial = (options) => useUpdate('vlsiMaterials', vlsiMaterialsService, options);
export const useDeleteVlsiMaterial = (options) => useDelete('vlsiMaterials', vlsiMaterialsService, options);

// GATE PYQs hooks
export const useGatePyqs = (options) => useGetAll('gatePyqs', gatePyqsService, options);
export const useGatePyq = (id, options) => useGetById('gatePyqs', gatePyqsService, id, options);
export const useCreateGatePyq = (options) => useCreate('gatePyqs', gatePyqsService, options);
export const useUpdateGatePyq = (options) => useUpdate('gatePyqs', gatePyqsService, options);
export const useDeleteGatePyq = (options) => useDelete('gatePyqs', gatePyqsService, options);

// Magazines hooks
export const useMagazines = (options) => useGetAll('magazines', magazinesService, options);
export const useMagazine = (id, options) => useGetById('magazines', magazinesService, id, options);
export const useCreateMagazine = (options) => useCreate('magazines', magazinesService, options);
export const useUpdateMagazine = (options) => useUpdate('magazines', magazinesService, options);
export const useDeleteMagazine = (options) => useDelete('magazines', magazinesService, options);

// Tests hooks
export const useTests = (options) => useGetAll('tests', testsService, options);
export const useTest = (id, options) => useGetById('tests', testsService, id, options);
export const useCreateTest = (options) => useCreate('tests', testsService, options);
export const useUpdateTest = (options) => useUpdate('tests', testsService, options);
export const useDeleteTest = (options) => useDelete('tests', testsService, options);

// Notifications hooks
export const useNotifications = (options) => useGetAll('notifications', notificationsService, options);
export const useNotification = (id, options) => useGetById('notifications', notificationsService, id, options);
export const useCreateNotification = (options) => useCreate('notifications', notificationsService, options);
export const useUpdateNotification = (options) => useUpdate('notifications', notificationsService, options);
export const useDeleteNotification = (options) => useDelete('notifications', notificationsService, options);

// Running Notifications hooks
export const useRunningNotifications = (options) => useGetAll('runningNotifications', runningNotificationsService, options);
export const useRunningNotification = (id, options) => useGetById('runningNotifications', runningNotificationsService, id, options);
export const useCreateRunningNotification = (options) => useCreate('runningNotifications', runningNotificationsService, options);
export const useUpdateRunningNotification = (options) => useUpdate('runningNotifications', runningNotificationsService, options);
export const useDeleteRunningNotification = (options) => useDelete('runningNotifications', runningNotificationsService, options);

// Team Photos hooks
export const useTeamPhotos = (options) => useGetAll('teamPhotos', teamPhotosService, options);
export const useTeamPhoto = (id, options) => useGetById('teamPhotos', teamPhotosService, id, options);
export const useCreateTeamPhoto = (options) => useCreate('teamPhotos', teamPhotosService, options);
export const useUpdateTeamPhoto = (options) => useUpdate('teamPhotos', teamPhotosService, options);
export const useDeleteTeamPhoto = (options) => useDelete('teamPhotos', teamPhotosService, options);

// Announcements hooks
export const useAnnouncements = (options) => useGetAll('announcements', announcementsService, options);
export const useAnnouncement = (id, options) => useGetById('announcements', announcementsService, id, options);
export const useCreateAnnouncement = (options) => useCreate('announcements', announcementsService, options);
export const useUpdateAnnouncement = (options) => useUpdate('announcements', announcementsService, options);
export const useDeleteAnnouncement = (options) => useDelete('announcements', announcementsService, options);

// Achievements hooks
export const useAchievements = (type, options) => {
  const queryKey = type ? ['achievements', type] : ['achievements'];
  return useQuery({
    queryKey,
    queryFn: () => achievementsService.getAll({ type }),
    ...options
  });
};

export const useActiveAchievements = (type, options) => {
  const queryKey = type ? ['achievements', 'active', type] : ['achievements', 'active'];
  return useQuery({
    queryKey,
    queryFn: () => achievementsService.get('/active', { params: { type } }),
    ...options
  });
};

export const useAchievement = (id, options) => useGetById('achievements', achievementsService, id, options);
export const useCreateAchievement = (options) => useCreate('achievements', achievementsService, options);
export const useUpdateAchievement = (options) => useUpdate('achievements', achievementsService, options);
export const useDeleteAchievement = (options) => useDelete('achievements', achievementsService, options);

// Photo Gallery hooks
export const usePhotoGalleries = (options) => useGetAll('photoGallery', photoGalleryService, options);
export const usePhotoGallery = (id, options) => useGetById('photoGallery', photoGalleryService, id, options);

export const usePhotoGalleryByCategory = (category, options) => {
  return useQuery({
    queryKey: ['photoGallery', 'category', category],
    queryFn: () => photoGalleryService.getByCategory(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
    ...options
  });
};

export const useCreatePhotoGallery = (options) => useCreate('photoGallery', photoGalleryService, options);
export const useUpdatePhotoGallery = (options) => useUpdate('photoGallery', photoGalleryService, options);
export const useDeletePhotoGallery = (options) => useDelete('photoGallery', photoGalleryService, options);

export const useTogglePhotoGalleryActive = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => photoGalleryService.toggleActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photoGallery'] });
      toast.success('Gallery status updated');
      options.onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update status');
      options.onError?.(error);
    }
  });
};

// Upload hooks
export const useUploadImage = (options = {}) => {
  return useMutation({
    mutationFn: (file) => uploadService.uploadImage(file),
    onSuccess: (data) => {
      toast.success('Image uploaded successfully');
      options.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to upload image');
      options.onError?.(error);
    }
  });
};

export const useUploadFile = (options = {}) => {
  return useMutation({
    mutationFn: (file) => uploadService.uploadFile(file),
    onSuccess: (data) => {
      toast.success('File uploaded successfully');
      options.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to upload file');
      options.onError?.(error);
    }
  });
};