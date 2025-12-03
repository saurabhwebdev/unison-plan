"use client";

import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Activity, TrendingUp, Clock, CheckCircle2 } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <AuthenticatedLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Welcome back, {user?.username}! Here's what's happening today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="transition-smooth hover-lift touch-manipulation">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
              <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Tasks in progress</p>
            </CardContent>
          </Card>

          <Card className="transition-smooth hover-lift touch-manipulation">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Tasks completed</p>
            </CardContent>
          </Card>

          <Card className="transition-smooth hover-lift touch-manipulation sm:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
              <CardTitle className="text-sm font-medium">Hours Logged</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="text-2xl font-bold">0h</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>
        </div>

        {/* Account Info */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
          <Card className="transition-smooth hover-lift">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Account Information</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Your profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-4 sm:p-6 pt-0">
              <div className="flex items-center justify-between transition-smooth hover:bg-muted/50 p-3 sm:p-2 rounded-lg -mx-2 touch-manipulation">
                <span className="text-sm font-medium">Username</span>
                <span className="text-sm text-muted-foreground truncate ml-2">{user?.username}</span>
              </div>
              <div className="flex items-center justify-between transition-smooth hover:bg-muted/50 p-3 sm:p-2 rounded-lg -mx-2 touch-manipulation">
                <span className="text-sm font-medium">Email</span>
                <span className="text-sm text-muted-foreground truncate ml-2">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between transition-smooth hover:bg-muted/50 p-3 sm:p-2 rounded-lg -mx-2 touch-manipulation">
                <span className="text-sm font-medium">Role</span>
                <Badge variant={user?.role === "admin" ? "default" : "secondary"} className="text-xs">
                  {user?.role?.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center justify-between transition-smooth hover:bg-muted/50 p-3 sm:p-2 rounded-lg -mx-2 touch-manipulation">
                <span className="text-sm font-medium">Status</span>
                <Badge variant={user?.isVerified ? "default" : "secondary"} className="text-xs">
                  {user?.isVerified ? "Verified" : "Unverified"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-smooth hover-lift">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Get started with these actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3 p-4 sm:p-6 pt-0">
              <div className="rounded-lg border p-4 sm:p-3 text-sm transition-smooth hover-border cursor-pointer touch-manipulation">
                <p className="font-medium">Invite Team Members</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Collaborate with your team by inviting members
                </p>
              </div>
              <div className="rounded-lg border p-4 sm:p-3 text-sm transition-smooth hover-border cursor-pointer touch-manipulation">
                <p className="font-medium">Customize Settings</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Personalize your experience in settings
                </p>
              </div>
              <div className="rounded-lg border p-4 sm:p-3 text-sm transition-smooth hover-border cursor-pointer touch-manipulation">
                <p className="font-medium">Track Your Time</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Start logging hours for better productivity
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
