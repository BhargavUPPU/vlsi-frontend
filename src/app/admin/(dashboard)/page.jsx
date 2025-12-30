"use client";

import { useState, useEffect } from "react";
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
import { getDashboardStats, getRecentActivity } from "@/lib/api/services/dashboard";
import { StatCardSkeleton, ActivityItemSkeleton } from "@/components/ui/LoadingSkeleton";
import { toast } from "sonner";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [statsResult, activityResult] = await Promise.all([
        getDashboardStats(),
        getRecentActivity(5)
      ]);

      if (statsResult.success) {
        setStats(statsResult.data);
      } else {
        throw new Error(statsResult.error);
      }

      if (activityResult.success) {
        setActivities(activityResult.data);
      }
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(err.message || "Failed to load dashboard data");
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const getIconComponent = (iconName) => {
    const icons = {
      Users,
      Calendar,
      FolderOpen,
    };
    return icons[iconName] || Users;
  };

  const statCards = stats ? [
    {
      title: "Total Members",
      value: stats.totalMembers.toString(),
      description: "Club members registered",
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Active Events",
      value: stats.activeEvents.toString(),
      description: `${stats.totalEvents} total events`,
      icon: Calendar,
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-100",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Projects",
      value: stats.totalProjects.toString(),
      description: `+${stats.recentProjects} new this month`,
      icon: FolderOpen,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Resources",
      value: stats.totalResources.toString(),
      description: "Books, materials & lectures",
      icon: BookOpen,
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ] : [];

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Welcome to the VLSI GVPCE(A) admin panel</p>
        </div>
        
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900">Failed to load dashboard</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <Button onClick={fetchDashboardData} variant="outline" size="sm">
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
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Dashboard
          </h2>
          <p className="text-muted-foreground mt-1">
            Welcome to the VLSI GVPCE(A) admin panel
          </p>
        </div>
        <Button onClick={fetchDashboardData} variant="outline" size="sm" disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          statCards.map((stat) => (
            <Card 
              key={stat.title} 
              className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`}></div>
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.iconBg} p-2 rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  {stat.description}
                </p>
              </CardContent>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient}`}></div>
            </Card>
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
              <TrendingUp className="h-5 w-5 text-gray-400" />
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
              <div className="space-y-4">
                {activities.map((activity, index) => {
                  const IconComponent = getIconComponent(activity.icon);
                  const colorMap = {
                    blue: { bg: "bg-blue-100", text: "text-blue-600" },
                    green: { bg: "bg-green-100", text: "text-green-600" },
                    purple: { bg: "bg-purple-100", text: "text-purple-600" },
                  };
                  const colors = colorMap[activity.color] || colorMap.blue;

                  return (
                    <div 
                      key={index} 
                      className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${colors.bg} flex-shrink-0`}>
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
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-3 text-gray-300" />
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
            <button 
              onClick={() => router.push('/admin/events/create-event')}
              className="w-full group rounded-xl border-2 border-gray-200 p-4 text-left hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                  <Plus className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Add New Event
                  </div>
                  <div className="text-sm text-gray-500">Create a new club event</div>
                </div>
                <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </button>

            <button 
              onClick={() => router.push('/admin/textBooks')}
              className="w-full group rounded-xl border-2 border-gray-200 p-4 text-left hover:border-green-400 hover:bg-green-50 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors">
                  <Upload className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                    Upload Resource
                  </div>
                  <div className="text-sm text-gray-500">Add study materials</div>
                </div>
                <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
              </div>
            </button>

            <button 
              onClick={() => router.push('/admin/clubMembers')}
              className="w-full group rounded-xl border-2 border-gray-200 p-4 text-left hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors">
                  <Settings className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                    Manage Members
                  </div>
                  <div className="text-sm text-gray-500">View and edit member list</div>
                </div>
                <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}