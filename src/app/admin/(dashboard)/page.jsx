"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Calendar, 
  FolderOpen, 
  BookOpen,
  TrendingUp,
  Activity
} from "lucide-react";

const stats = [
  {
    title: "Total Members",
    value: "156",
    description: "+12% from last month",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Active Events",
    value: "8",
    description: "3 upcoming this week",
    icon: Calendar,
    color: "text-green-600",
  },
  {
    title: "Projects",
    value: "24",
    description: "+4 new this month",
    icon: FolderOpen,
    color: "text-purple-600",
  },
  {
    title: "Resources",
    value: "89",
    description: "Books, materials & lectures",
    icon: BookOpen,
    color: "text-orange-600",
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to the VLSI GVPCE(A) admin panel
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates from your admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">New member registered</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                  <Calendar className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Event created: VLSI Workshop</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                  <FolderOpen className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Project updated: IoT Security</p>
                  <p className="text-xs text-muted-foreground">3 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full rounded-lg border border-gray-200 p-3 text-left hover:bg-gray-50">
              <div className="font-medium">Add New Event</div>
              <div className="text-sm text-muted-foreground">Create a new club event</div>
            </button>
            <button className="w-full rounded-lg border border-gray-200 p-3 text-left hover:bg-gray-50">
              <div className="font-medium">Upload Resource</div>
              <div className="text-sm text-muted-foreground">Add study materials</div>
            </button>
            <button className="w-full rounded-lg border border-gray-200 p-3 text-left hover:bg-gray-50">
              <div className="font-medium">Manage Members</div>
              <div className="text-sm text-muted-foreground">View and edit member list</div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}