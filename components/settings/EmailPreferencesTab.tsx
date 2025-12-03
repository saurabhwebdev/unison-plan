"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Loader2, Mail, Bell, Settings as SettingsIcon } from "lucide-react";
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

export function EmailPreferencesTab() {
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
    <div className="space-y-4">
      {/* Global Settings */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Global Settings</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Control all email notifications and delivery frequency
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
            <div className="flex-1">
              <Label htmlFor="enabled" className="text-sm font-medium">Enable Email Notifications</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Turn all email notifications on or off
              </p>
            </div>
            <Switch
              id="enabled"
              checked={preferences.enabled}
              onCheckedChange={(checked) => updatePreference("enabled", checked)}
              className="ml-4"
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="frequency" className="text-sm">Notification Frequency</Label>
            <Select
              value={preferences.frequency}
              onValueChange={(value) => updatePreference("frequency", value)}
              disabled={!preferences.enabled}
            >
              <SelectTrigger id="frequency" className="h-10">
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
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Project Notifications</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Configure notifications for project activities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
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
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Task Notifications</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Configure notifications for task activities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
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
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Client Notifications</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Configure notifications for client activities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
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
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Other Notifications</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Additional notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
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
      <div className="flex justify-end gap-4 pt-2">
        <Button variant="outline" onClick={fetchPreferences} disabled={saving} className="touch-manipulation">
          Reset
        </Button>
        <Button onClick={handleSave} disabled={saving} className="touch-manipulation">
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
    <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
      <div className="flex-1">
        <Label className="text-sm font-medium cursor-pointer">{label}</Label>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} className="ml-4" />
    </div>
  );
}
