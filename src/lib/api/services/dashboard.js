import {apiClient} from '../client';

/**
 * Dashboard API Service
 * Handles all dashboard-related data fetching
 */

/**
 * Get dashboard statistics
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

        const totalMembers = membersResponse.data?.length || 0;
        const totalEvents = eventsResponse.data?.length || 0;
        const totalProjects = projectsResponse.data?.length || 0;
        const totalResources =
            (textBooksResponse.data?.length || 0) +
            (vlsiMaterialsResponse.data?.length || 0) +
            (nptelLecturesResponse.data?.length || 0);

        // Calculate active events (events with future dates)
        const now = new Date();
        const activeEvents = eventsResponse.data?.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= now;
        }).length || 0;

        // Calculate recent projects (projects from this month)
        const thisMonth = new Date().getMonth();
        const thisYear = new Date().getFullYear();
        const recentProjects = projectsResponse.data?.filter(project => {
            const projectDate = new Date(project.createdAt);
            return projectDate.getMonth() === thisMonth && projectDate.getFullYear() === thisYear;
        }).length || 0;

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
        return {
            success: false,
            error: error.message || 'Failed to fetch dashboard statistics',
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
            apiClient.get('/clubMembers'),
            apiClient.get('/events'),
            apiClient.get('/projects'),
        ]);

        const activities = [];

        // Add member activities
        if (membersResponse.data && Array.isArray(membersResponse.data)) {
            membersResponse.data.slice(0, 3).forEach(member => {
                activities.push({
                    type: 'member',
                    icon: 'Users',
                    title: 'New member registered',
                    description: member.name || 'New member',
                    timestamp: member.createdAt || new Date(),
                    color: 'blue',
                });
            });
        }

        // Add event activities
        if (eventsResponse.data && Array.isArray(eventsResponse.data)) {
            eventsResponse.data.slice(0, 3).forEach(event => {
                activities.push({
                    type: 'event',
                    icon: 'Calendar',
                    title: `Event created: ${event.title || 'New Event'}`,
                    description: event.description || '',
                    timestamp: event.createdAt || new Date(),
                    color: 'green',
                });
            });
        }

        // Add project activities
        if (projectsResponse.data && Array.isArray(projectsResponse.data)) {
            projectsResponse.data.slice(0, 3).forEach(project => {
                activities.push({
                    type: 'project',
                    icon: 'FolderOpen',
                    title: `Project updated: ${project.title || 'New Project'}`,
                    description: project.Introduction || '',
                    timestamp: project.updatedAt || project.createdAt || new Date(),
                    color: 'purple',
                });
            });
        }

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
        return {
            success: false,
            error: error.message || 'Failed to fetch recent activity',
        };
    }
};
