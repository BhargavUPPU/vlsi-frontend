import {apiClient} from '../client';

/**
 * Dashboard API Service
 * Handles all dashboard-related data fetching
 * 
 * NOTE: Provides both optimized and legacy methods
 */

/**
 * Get dashboard data using the optimized endpoint (RECOMMENDED)
 * Single API call for all dashboard data - best performance
 * @param {number} activityLimit - Number of activity items to fetch
 * @returns {Promise<Object>} Complete dashboard data (stats + activity)
 */
export const getDashboardOverview = async (activityLimit = 10) => {
    try {
        const response = await apiClient.get(`/dashboard/overview?activityLimit=${activityLimit}`);
        
        if (response.data?.success) {
            return {
                success: true,
                data: {
                    ...response.data.stats,
                    activities: response.data.activity || [],
                },
            };
        }
        
        throw new Error(response.data?.error || 'Failed to fetch dashboard overview');
    } catch (error) {
        console.error('Error fetching dashboard overview:', error);
        
        let errorMessage = 'Failed to fetch dashboard data';
        
        if (error.response) {
            errorMessage = error.response.data?.message || error.response.data?.error || `Server error: ${error.response.status}`;
        } else if (error.request) {
            errorMessage = 'Unable to reach the server. Please check your connection.';
        } else {
            errorMessage = error.message || errorMessage;
        }
        
        return {
            success: false,
            error: errorMessage,
            errorCode: error.response?.status,
        };
    }
};

/**
 * Get dashboard statistics (LEGACY - use getDashboardOverview instead)
 * Makes multiple API calls - less efficient but more flexible
 * @returns {Promise<Object>} Dashboard statistics including counts for members, events, projects, resources
 */
export const getDashboardStats = async () => {
    try {
        const [
            membersResponse,
            eventsResponse,
            projectsResponse,
            textBooksResponse,
            vlsiMaterialsResponse,
            nptelLecturesResponse,
        ] = await Promise.all([
            apiClient.get('/clubMembers'),
            apiClient.get('/events'),
            apiClient.get('/projects'),
            apiClient.get('/textBooks'),
            apiClient.get('/vlsiMaterials'),
            apiClient.get('/nptelLectures'),
        ]);

        // Backend returns { data: [...], total: number }
        const members = Array.isArray(membersResponse.data?.data) ? membersResponse.data.data : [];
        const events = Array.isArray(eventsResponse.data?.data) ? eventsResponse.data.data : [];
        const projects = Array.isArray(projectsResponse.data?.data) ? projectsResponse.data.data : [];
        const textBooks = Array.isArray(textBooksResponse.data?.data) ? textBooksResponse.data.data : [];
        const vlsiMaterials = Array.isArray(vlsiMaterialsResponse.data?.data) ? vlsiMaterialsResponse.data.data : [];
        const nptelLectures = Array.isArray(nptelLecturesResponse.data?.data) ? nptelLecturesResponse.data.data : [];

        const totalMembers = members.length;
        const totalEvents = events.length;
        const totalProjects = projects.length;
        const totalResources = textBooks.length + vlsiMaterials.length + nptelLectures.length;

        // Calculate active events (events with future dates)
        const now = new Date();
        const activeEvents = events.filter(event => {
            try {
                const eventDate = new Date(event.eventDate || event.date);
                return eventDate >= now;
            } catch {
                return false;
            }
        }).length;

        // Calculate recent projects (projects from this month)
        const thisMonth = new Date().getMonth();
        const thisYear = new Date().getFullYear();
        const recentProjects = projects.filter(project => {
            try {
                const projectDate = new Date(project.createdAt);
                return projectDate.getMonth() === thisMonth && projectDate.getFullYear() === thisYear;
            } catch {
                return false;
            }
        }).length;

        return {
            success: true,
            data: {
                totalMembers,
                totalEvents,
                activeEvents,
                totalProjects,
                recentProjects,
                totalResources,
            },
        };
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        
        // Production-level error handling
        let errorMessage = 'Failed to fetch dashboard statistics';
        
        if (error.response) {
            // Server responded with error status
            errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
        } else if (error.request) {
            // Request was made but no response received
            errorMessage = 'Unable to reach the server. Please check your connection.';
        } else {
            // Something else happened
            errorMessage = error.message || errorMessage;
        }
        
        return {
            success: false,
            error: errorMessage,
            errorCode: error.response?.status,
        };
    }
};

/**
 * Get recent activity feed
 * @param {number} limit - Number of activities to fetch
 * @returns {Promise<Object>} Recent activity items
 */
export const getRecentActivity = async (limit = 10) => {
    try {
        const [
            membersResponse,
            eventsResponse,
            projectsResponse,
        ] = await Promise.all([
            apiClient.get('/clubMembers?limit=3'),
            apiClient.get('/events?limit=3'),
            apiClient.get('/projects?limit=3'),
        ]);

        const activities = [];

        // Backend returns { data: [...], total: number }
        const members = Array.isArray(membersResponse.data?.data) ? membersResponse.data.data : [];
        const events = Array.isArray(eventsResponse.data?.data) ? eventsResponse.data.data : [];
        const projects = Array.isArray(projectsResponse.data?.data) ? projectsResponse.data.data : [];

        // Add member activities
        members.slice(0, 3).forEach(member => {
            if (member?.name) {
                activities.push({
                    type: 'member',
                    icon: 'Users',
                    title: `New member: ${member.name}`,
                    description: member.rollNumber || member.email || '',
                    timestamp: member.createdAt || new Date(),
                    color: 'blue',
                });
            }
        });

        // Add event activities
        events.slice(0, 3).forEach(event => {
            if (event?.title) {
                activities.push({
                    type: 'event',
                    icon: 'Calendar',
                    title: `Event: ${event.title}`,
                    description: event.description || '',
                    timestamp: event.createdAt || new Date(),
                    color: 'green',
                });
            }
        });

        // Add project activities
        projects.slice(0, 3).forEach(project => {
            if (project?.title) {
                activities.push({
                    type: 'project',
                    icon: 'FolderOpen',
                    title: `Project: ${project.title}`,
                    description: project.Introduction || project.description || '',
                    timestamp: project.updatedAt || project.createdAt || new Date(),
                    color: 'purple',
                });
            }
        });

        // Sort by timestamp (most recent first) and limit
        const sortedActivities = activities
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit);

        return {
            success: true,
            data: sortedActivities,
        };
    } catch (error) {
        console.error('Error fetching recent activity:', error);
        
        // Production-level error handling
        let errorMessage = 'Failed to fetch recent activity';
        
        if (error.response) {
            errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
        } else if (error.request) {
            errorMessage = 'Unable to reach the server. Please check your connection.';
        } else {
            errorMessage = error.message || errorMessage;
        }
        
        return {
            success: false,
            error: errorMessage,
            errorCode: error.response?.status,
        };
    }
};
