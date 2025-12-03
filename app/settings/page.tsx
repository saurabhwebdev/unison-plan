"use client";

import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Lock,
  Bell,
  Mail,
  Shield,
  KeyRound,
  CheckCircle,
  Loader2,
  Save
} from "lucide-react";

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Password changed successfully!",
        });
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to change password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password",
        variant: "destructive",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your account settings and preferences
            </p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="profile" className="gap-2 touch-manipulation">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2 touch-manipulation">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2 touch-manipulation">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            {/* Profile Overview Card */}
            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                      {user?.username?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-semibold">{user?.username}</h3>
                      <Badge variant={user?.role === "admin" ? "default" : "secondary"} className="h-6">
                        {user?.role === "admin" && <Shield className="h-3 w-3 mr-1" />}
                        {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                      </Badge>
                      {user?.isVerified && (
                        <Badge variant="outline" className="h-6 border-green-200 bg-green-50 text-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {user?.email}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Account Information
                </CardTitle>
                <CardDescription className="text-xs">
                  Your basic account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-xs font-medium text-muted-foreground">
                      Username
                    </Label>
                    <Input
                      id="username"
                      value={user?.username || ""}
                      disabled
                      className="h-9 bg-muted/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="h-9 bg-muted/50"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Shield className="h-3 w-3" />
                    Contact your administrator to update your profile information
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4">
            {/* Change Password Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-primary" />
                  Change Password
                </CardTitle>
                <CardDescription className="text-xs">
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password" className="text-sm">
                      Current Password
                    </Label>
                    <Input
                      id="current-password"
                      type="password"
                      placeholder="Enter your current password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, currentPassword: e.target.value })
                      }
                      required
                      className="h-10 touch-manipulation"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="new-password" className="text-sm">
                        New Password
                      </Label>
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="Enter new password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, newPassword: e.target.value })
                        }
                        required
                        className="h-10 touch-manipulation"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-sm">
                        Confirm Password
                      </Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm new password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                        }
                        required
                        className="h-10 touch-manipulation"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-4">
                      Password must be at least 6 characters long
                    </p>
                    <Button
                      type="submit"
                      disabled={passwordLoading}
                      className="w-full sm:w-auto touch-manipulation"
                    >
                      {passwordLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Update Password
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Security Overview */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Security Status
                </CardTitle>
                <CardDescription className="text-xs">
                  Overview of your account security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Email Verified</p>
                      <p className="text-xs text-muted-foreground">
                        Your email address is verified
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Active
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <Lock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Password Protection</p>
                      <p className="text-xs text-muted-foreground">
                        Your account is password protected
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Enabled
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Email Notifications
                </CardTitle>
                <CardDescription className="text-xs">
                  Manage your email notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-medium">Login Notifications</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Receive email alerts when you log in to your account
                    </p>
                  </div>
                  <Switch defaultChecked disabled className="ml-4" />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-medium">Team Invitations</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Get notified when you're invited to join a team
                    </p>
                  </div>
                  <Switch defaultChecked disabled className="ml-4" />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-medium">Password Changes</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Receive alerts when your password is changed
                    </p>
                  </div>
                  <Switch defaultChecked disabled className="ml-4" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  System Notifications
                </CardTitle>
                <CardDescription className="text-xs">
                  Manage system and activity notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-medium">Project Updates</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Get notified about project changes and updates
                    </p>
                  </div>
                  <Switch disabled className="ml-4" />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-medium">Activity Alerts</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Receive notifications about team activity
                    </p>
                  </div>
                  <Switch disabled className="ml-4" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  );
}
