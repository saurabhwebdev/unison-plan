"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Loader2, Mail, Bell, Settings } from "lucide-react";
import { toast } from "sonner";

interface EmailPreferences {
  enabled: boolean;
  frequency: "instant" | "daily_digest" | "weekly_digest";
  projectCreated: boolean;
  projectAssigned: boolean;
  projectStatusChanged: boolean;
  projectDeadlineApproaching: boolean;
  projectCompleted: boolean;
  taskAssigned: boolean;
  taskDueSoon: boolean;
  taskOverdue: boolean;
  taskCompleted: boolean;
  taskStatusChanged: boolean;
  taskMentioned: boolean;
  clientAssigned: boolean;
  clientStatusChanged: boolean;
  budgetAlert: boolean;
  teamMemberAdded: boolean;
  weeklyDigest: boolean;
  monthlyReport: boolean;
}

export default function EmailSettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState<EmailPreferences>({
    enabled: true,
    frequency: "instant",
    projectCreated: true,
    projectAssigned: true,
    projectStatusChanged: true,
    projectDeadlineApproaching: true,
    projectCompleted: true,
    taskAssigned: true,
    taskDueSoon: true,
    taskOverdue: true,
    taskCompleted: false,
    taskStatusChanged: false,
    taskMentioned: true,
    clientAssigned: true,
    clientStatusChanged: false,
    budgetAlert: true,
    teamMemberAdded: true,
    weeklyDigest: false,
    monthlyReport: false,
  });

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await fetch("/api/user/email-preferences");
      const data = await response.json();

      if (data.success && data.data) {
        setPreferences(data.data);
        console.log("Loaded preferences:", data.data);
      } else {
        toast.error("Failed to load email preferences");
        console.error("Failed to load preferences:", data);
      }
    } catch (error) {
      console.error("Error loading email preferences:", error);
      toast.error("Error loading email preferences");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      console.log("Saving preferences:", preferences);

      const response = await fetch("/api/user/email-preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Email preferences saved successfully! 💾");
        // Update local state with saved data to ensure sync
        if (data.data) {
          setPreferences(data.data);
          console.log("Preferences saved and updated:", data.data);
        }
      } else {
        toast.error(data.error || "Failed to save email preferences");
        console.error("Save failed:", data);
      }
    } catch (error) {
      console.error("Error saving email preferences:", error);
      toast.error("Error saving email preferences");
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = (key: keyof EmailPreferences, value: any) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Email Notifications</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your email notification preferences
        </p>
      </div>

      {/* Global Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <CardTitle>Global Settings</CardTitle>
          </div>
          <CardDescription>
            Control all email notifications and delivery frequency
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enabled">Enable Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Turn all email notifications on or off
              </p>
            </div>
            <Switch
              id="enabled"
              checked={preferences.enabled}
              onCheckedChange={(checked) => updatePreference("enabled", checked)}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="frequency">Notification Frequency</Label>
            <Select
              value={preferences.frequency}
              onValueChange={(value) => updatePreference("frequency", value)}
              disabled={!preferences.enabled}
            >
              <SelectTrigger id="frequency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instant">Instant - Get notified immediately</SelectItem>
                <SelectItem value="daily_digest">Daily Digest - Once per day</SelectItem>
                <SelectItem value="weekly_digest">Weekly Digest - Once per week</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choose how often you want to receive email notifications
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Project Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Project Notifications</CardTitle>
          </div>
          <CardDescription>
            Configure notifications for project activities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NotificationToggle
            label="Project Created"
            description="When a new project is created"
            checked={preferences.projectCreated}
            onCheckedChange={(checked) => updatePreference("projectCreated", checked)}
            disabled={!preferences.enabled}
          />
          <NotificationToggle
            label="Project Assigned"
            description="When you are assigned to a project"
            checked={preferences.projectAssigned}
            onCheckedChange={(checked) => updatePreference("projectAssigned", checked)}
            disabled={!preferences.enabled}
          />
          <NotificationToggle
            label="Project Status Changed"
            description="When a project status is updated"
            checked={preferences.projectStatusChanged}
            onCheckedChange={(checked) => updatePreference("projectStatusChanged", checked)}
            disabled={!preferences.enabled}
          />
          <NotificationToggle
            label="Project Deadline Approaching"
            description="When a project deadline is near"
            checked={preferences.projectDeadlineApproaching}
            onCheckedChange={(checked) => updatePreference("projectDeadlineApproaching", checked)}
            disabled={!preferences.enabled}
          />
          <NotificationToggle
            label="Project Completed"
            description="When a project is marked as completed"
            checked={preferences.projectCompleted}
            onCheckedChange={(checked) => updatePreference("projectCompleted", checked)}
            disabled={!preferences.enabled}
          />
        </CardContent>
      </Card>

      {/* Task Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Task Notifications</CardTitle>
          </div>
          <CardDescription>
            Configure notifications for task activities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NotificationToggle
            label="Task Assigned"
            description="When a task is assigned to you"
            checked={preferences.taskAssigned}
            onCheckedChange={(checked) => updatePreference("taskAssigned", checked)}
            disabled={!preferences.enabled}
          />
          <NotificationToggle
            label="Task Due Soon"
            description="When a task deadline is approaching"
            checked={preferences.taskDueSoon}
            onCheckedChange={(checked) => updatePreference("taskDueSoon", checked)}
            disabled={!preferences.enabled}
          />
          <NotificationToggle
            label="Task Overdue"
            description="When a task is past its due date"
            checked={preferences.taskOverdue}
            onCheckedChange={(checked) => updatePreference("taskOverdue", checked)}
            disabled={!preferences.enabled}
          />
          <NotificationToggle
            label="Task Completed"
            description="When a task is marked as completed"
            checked={preferences.taskCompleted}
            onCheckedChange={(checked) => updatePreference("taskCompleted", checked)}
            disabled={!preferences.enabled}
          />
          <NotificationToggle
            label="Task Status Changed"
            description="When a task status is updated"
            checked={preferences.taskStatusChanged}
            onCheckedChange={(checked) => updatePreference("taskStatusChanged", checked)}
            disabled={!preferences.enabled}
          />
          <NotificationToggle
            label="Task Mentioned"
            description="When you are mentioned in a task"
            checked={preferences.taskMentioned}
            onCheckedChange={(checked) => updatePreference("taskMentioned", checked)}
            disabled={!preferences.enabled}
          />
        </CardContent>
      </Card>

      {/* Client Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Client Notifications</CardTitle>
          </div>
          <CardDescription>
            Configure notifications for client activities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NotificationToggle
            label="Client Assigned"
            description="When a client is assigned to you"
            checked={preferences.clientAssigned}
            onCheckedChange={(checked) => updatePreference("clientAssigned", checked)}
            disabled={!preferences.enabled}
          />
          <NotificationToggle
            label="Client Status Changed"
            description="When a client status is updated"
            checked={preferences.clientStatusChanged}
            onCheckedChange={(checked) => updatePreference("clientStatusChanged", checked)}
            disabled={!preferences.enabled}
          />
        </CardContent>
      </Card>

      {/* Other Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <CardTitle>Other Notifications</CardTitle>
          </div>
          <CardDescription>
            Additional notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NotificationToggle
            label="Budget Alert"
            description="When project budget thresholds are reached"
            checked={preferences.budgetAlert}
            onCheckedChange={(checked) => updatePreference("budgetAlert", checked)}
            disabled={!preferences.enabled}
          />
          <NotificationToggle
            label="Team Member Added"
            description="When team members are added to projects"
            checked={preferences.teamMemberAdded}
            onCheckedChange={(checked) => updatePreference("teamMemberAdded", checked)}
            disabled={!preferences.enabled}
          />
          <NotificationToggle
            label="Weekly Digest"
            description="Receive a weekly summary of activities"
            checked={preferences.weeklyDigest}
            onCheckedChange={(checked) => updatePreference("weeklyDigest", checked)}
            disabled={!preferences.enabled}
          />
          <NotificationToggle
            label="Monthly Report"
            description="Receive a monthly activity report"
            checked={preferences.monthlyReport}
            onCheckedChange={(checked) => updatePreference("monthlyReport", checked)}
            disabled={!preferences.enabled}
          />
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-4 sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-t">
        <Button variant="outline" onClick={fetchPreferences} disabled={saving}>
          Reset
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
}

interface NotificationToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

function NotificationToggle({
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
}: NotificationToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5 flex-1">
        <Label className="text-sm font-medium">{label}</Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
    </div>
  );
}
