"use client";

import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Calendar, 
  FolderOpen, 
  BookOpen,
  TrendingUp,
  ArrowUpRight,
  Plus,
  Upload,
  Settings,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { getDashboardStats, getRecentActivity, getDashboardOverview } from "@/lib/api/services/dashboard";
import { StatCardSkeleton, ActivityItemSkeleton } from "@/components/ui/LoadingSkeleton";
import { toast } from "sonner";

// Constants for better maintainability
const RECENT_ACTIVITY_LIMIT = 5;
const REFRESH_INTERVAL = 30000; // 30 seconds auto-refresh

// Icon mapping - extracted for performance
const ICON_MAP = {
  Users,
  Calendar,
  FolderOpen,
  BookOpen,
};

// Color mapping - extracted as constant
const COLOR_MAP = {
  blue: { bg: "bg-blue-100", text: "text-blue-600" },
  green: { bg: "bg-green-100", text: "text-green-600" },
  purple: { bg: "bg-purple-100", text: "text-purple-600" },
  orange: { bg: "bg-orange-100", text: "text-orange-600" },
};

// Optimized time calculation
const getTimeAgo = (timestamp) => {
  const now = Date.now();
  const past = new Date(timestamp).getTime();
  const diffMs = now - past;
  
  if (diffMs < 60000) return "Just now";
  
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMs / 3600000);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays < 30) return `${diffDays}d ago`;
  
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths}mo ago`;
};

// Memoized StatCard Component for performance
const StatCard = memo(({ stat }) => {
  return (
    <Card 
      className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
      role="article"
      aria-label={`${stat.title}: ${stat.value}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`} aria-hidden="true"></div>
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700">
          {stat.title}
        </CardTitle>
        <div className={`${stat.iconBg} p-2 rounded-lg group-hover:scale-110 transition-transform duration-300`} aria-hidden="true">
          <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
        <p className="text-xs text-gray-600 flex items-center gap-1">
          {stat.description}
        </p>
      </CardContent>
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient}`} aria-hidden="true"></div>
    </Card>
  );
});

StatCard.displayName = "StatCard";

// Memoized ActivityItem Component
const ActivityItem = memo(({ activity, index }) => {
  const IconComponent = ICON_MAP[activity.icon] || Users;
  const colors = COLOR_MAP[activity.color] || COLOR_MAP.blue;

  return (
    <div 
      key={`${activity.title}-${index}`}
      className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
      role="article"
    >
      <div 
        className={`flex h-10 w-10 items-center justify-center rounded-full ${colors.bg} flex-shrink-0`}
        aria-hidden="true"
      >
        <IconComponent className={`h-5 w-5 ${colors.text}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {activity.title}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          {getTimeAgo(activity.timestamp)}
        </p>
      </div>
    </div>
  );
});

ActivityItem.displayName = "ActivityItem";

// Memoized QuickAction Component
const QuickAction = memo(({ title, description, icon: Icon, color, onClick }) => {
  const colorStyles = {
    blue: { border: "border-blue-400", bg: "bg-blue-50", iconBg: "bg-blue-100", iconHover: "bg-blue-200", text: "text-blue-600" },
    green: { border: "border-green-400", bg: "bg-green-50", iconBg: "bg-green-100", iconHover: "bg-green-200", text: "text-green-600" },
    purple: { border: "border-purple-400", bg: "bg-purple-50", iconBg: "bg-purple-100", iconHover: "bg-purple-200", text: "text-purple-600" },
  };
  
  const styles = colorStyles[color] || colorStyles.blue;

  return (
    <button 
      onClick={onClick}
      className={`w-full group rounded-xl border-2 border-gray-200 p-4 text-left hover:${styles.border} hover:${styles.bg} transition-all duration-200 hover:shadow-md`}
      aria-label={title}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${styles.iconBg} group-hover:${styles.iconHover} transition-colors`} aria-hidden="true">
          <Icon className={`h-5 w-5 ${styles.text}`} />
        </div>
        <div className="flex-1">
          <div className={`font-semibold text-gray-900 group-hover:${styles.text} transition-colors`}>
            {title}
          </div>
          <div className="text-sm text-gray-500">{description}</div>
        </div>
        <ArrowUpRight className={`h-5 w-5 text-gray-400 group-hover:${styles.text} transition-colors`} aria-hidden="true" />
      </div>
    </button>
  );
});

QuickAction.displayName = "QuickAction";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  // Memoized fetch function - uses optimized single endpoint
  const fetchDashboardData = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    setError(null);
    
    try {
      // Use the optimized overview endpoint for best performance
      const result = await getDashboardOverview(RECENT_ACTIVITY_LIMIT);

      if (result.success) {
        const { activities, ...statsData } = result.data;
        setStats(statsData);
        setActivities(activities || []);
      } else {
        throw new Error(result.error || "Failed to fetch dashboard data");
      }
      
      setLastRefresh(new Date());
      if (silent) {
        toast.success("Dashboard updated", { duration: 2000 });
      }
    } catch (err) {
      console.error("Dashboard error:", err);
      const errorMessage = err.message || "Failed to load dashboard data";
      setError(errorMessage);
      
      if (!silent) {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Auto-refresh every 30 seconds (optional - can be configured)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData(true); // Silent refresh
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // Memoized stat cards configuration
  const statCards = useMemo(() => {
    if (!stats) return [];
    
    return [
      {
        title: "Total Members",
        value: stats.totalMembers?.toString() || "0",
        description: "Club members registered",
        icon: Users,
        gradient: "from-blue-500 to-blue-600",
        bgGradient: "from-blue-50 to-blue-100",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
      },
      {
        title: "Active Events",
        value: stats.activeEvents?.toString() || "0",
        description: `${stats.totalEvents || 0} total events`,
        icon: Calendar,
        gradient: "from-green-500 to-emerald-600",
        bgGradient: "from-green-50 to-emerald-100",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
      },
      {
        title: "Projects",
        value: stats.totalProjects?.toString() || "0",
        description: `+${stats.recentProjects || 0} new this month`,
        icon: FolderOpen,
        gradient: "from-purple-500 to-purple-600",
        bgGradient: "from-purple-50 to-purple-100",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
      },
      {
        title: "Resources",
        value: stats.totalResources?.toString() || "0",
        description: "Books, materials & lectures",
        icon: BookOpen,
        gradient: "from-orange-500 to-orange-600",
        bgGradient: "from-orange-50 to-orange-100",
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
      },
    ];
  }, [stats]);

  // Memoized quick actions
  const quickActions = useMemo(() => [
    {
      title: "Add New Event",
      description: "Create a new club event",
      icon: Plus,
      color: "blue",
      onClick: () => router.push('/admin/events/create-event'),
    },
    {
      title: "Upload Resource",
      description: "Add study materials",
      icon: Upload,
      color: "green",
      onClick: () => router.push('/admin/textBooks'),
    },
    {
      title: "Manage Members",
      description: "View and edit member list",
      icon: Settings,
      color: "purple",
      onClick: () => router.push('/admin/clubMembers'),
    },
  ], [router]);

  // Manual refresh handler
  const handleRefresh = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Error state UI
  if (error) {
    return (
      <div className="space-y-6" role="alert" aria-live="assertive">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Welcome to the VLSI GVPCE(A) admin panel</p>
        </div>
        
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <AlertCircle className="h-8 w-8 text-red-600" aria-hidden="true" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900">Failed to load dashboard</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <Button 
                onClick={handleRefresh} 
                variant="outline" 
                size="sm"
                aria-label="Retry loading dashboard"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome to the VLSI GVPCE(A) admin panel
          </p>
        </div>
        <div className="flex items-center gap-2">
          {lastRefresh && (
            <span className="text-xs text-gray-500 hidden sm:inline">
              Updated {getTimeAgo(lastRefresh)}
            </span>
          )}
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            size="sm" 
            disabled={isLoading}
            aria-label="Refresh dashboard data"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" role="region" aria-label="Statistics overview">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          statCards.map((stat) => (
            <StatCard key={stat.title} stat={stat} />
          ))
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity */}
        <Card className="col-span-4 shadow-md border-0">
          <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Recent Activity</CardTitle>
                <CardDescription className="mt-1">
                  Latest updates from your admin panel
                </CardDescription>
              </div>
              <TrendingUp className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="space-y-4">
                <ActivityItemSkeleton />
                <ActivityItemSkeleton />
                <ActivityItemSkeleton />
              </div>
            ) : activities.length > 0 ? (
              <div className="space-y-4" role="feed" aria-label="Recent activity feed">
                {activities.map((activity, index) => (
                  <ActivityItem 
                    key={`${activity.timestamp}-${index}`} 
                    activity={activity} 
                    index={index} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-3 text-gray-300" aria-hidden="true" />
                <p className="text-sm">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-3 shadow-md border-0">
          <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
            <CardTitle className="text-xl">Quick Actions</CardTitle>
            <CardDescription className="mt-1">
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            {quickActions.map((action) => (
              <QuickAction key={action.title} {...action} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}