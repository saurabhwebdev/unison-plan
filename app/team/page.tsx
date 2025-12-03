"use client";

import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Users, Mail, Loader2, UserPlus, Shield, CheckCircle, Edit, Trash2, MoreVertical, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface TeamMember {
  _id: string;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
  invitedBy?: string;
  createdAt: string;
}

export default function TeamPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [inviteFormData, setInviteFormData] = useState({
    username: "",
    email: "",
    role: "user",
  });
  const [editFormData, setEditFormData] = useState({
    username: "",
    email: "",
    role: "user",
  });
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch("/api/team/list");
      const data = await response.json();

      if (response.ok) {
        setTeamMembers(data.data || data.users);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch team members",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch team members",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);

    try {
      const response = await fetch("/api/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inviteFormData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Team member invited successfully! Invitation email sent.",
        });
        setInviteDialogOpen(false);
        setInviteFormData({ username: "", email: "", role: "user" });
        fetchTeamMembers();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to invite team member",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to invite team member",
        variant: "destructive",
      });
    } finally {
      setInviting(false);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setSelectedMember(member);
    setEditFormData({
      username: member.username,
      email: member.email,
      role: member.role,
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;

    setUpdating(true);

    try {
      const response = await fetch("/api/team/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedMember._id,
          ...editFormData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Team member updated successfully!",
        });
        setEditDialogOpen(false);
        setSelectedMember(null);
        fetchTeamMembers();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update team member",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update team member",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteClick = (member: TeamMember) => {
    setSelectedMember(member);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedMember) return;

    setDeleting(true);

    try {
      const response = await fetch(`/api/team/delete?userId=${selectedMember._id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Team member deleted successfully!",
        });
        setDeleteDialogOpen(false);
        setSelectedMember(null);
        fetchTeamMembers();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete team member",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete team member",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedMembers.length === teamMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(teamMembers.map((m) => m._id));
    }
  };

  const toggleSelectMember = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleBulkDelete = async () => {
    try {
      const deletePromises = selectedMembers.map((id) =>
        fetch(`/api/team/delete?userId=${id}`, { method: "DELETE" })
      );

      const results = await Promise.all(deletePromises);
      const allSuccessful = results.every((res) => res.ok);

      if (allSuccessful) {
        toast({
          title: "Success",
          description: `${selectedMembers.length} team member(s) deleted successfully`,
        });
        setSelectedMembers([]);
        fetchTeamMembers();
      } else {
        toast({
          title: "Error",
          description: "Some team members could not be deleted",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete team members",
        variant: "destructive",
      });
    } finally {
      setShowBulkDeleteDialog(false);
    }
  };

  const canManageTeam = user?.role === "admin" || user?.role === "manager";
  const canEditMember = (member: TeamMember) => {
    if (user?.role === "admin") return true;
    if (user?.role === "manager" && member.role !== "admin") return true;
    return false;
  };

  const formatRole = (role: string) => {
    switch (role) {
      case "project_manager":
        return "Project Manager";
      case "business_development":
        return "Business Development";
      default:
        return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Team</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedMembers.length > 0
                ? `${selectedMembers.length} selected`
                : loading ? "Loading..." : `${teamMembers.length} ${teamMembers.length === 1 ? "member" : "members"}`
              }
            </p>
          </div>
          {canManageTeam && (
            <div className="flex gap-2">
              {selectedMembers.length > 0 ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedMembers([])}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Selection
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setShowBulkDeleteDialog(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete ({selectedMembers.length})
                  </Button>
                </>
              ) : (
                <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="transition-smooth touch-manipulation gap-2">
                      <UserPlus className="h-4 w-4" />
                      Invite Member
                    </Button>
                  </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-primary" />
                    Invite Team Member
                  </DialogTitle>
                  <DialogDescription className="text-sm">
                    Send an invitation email with temporary credentials
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleInvite} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      value={inviteFormData.username}
                      onChange={(e) => setInviteFormData({ ...inviteFormData, username: e.target.value })}
                      required
                      placeholder="johndoe"
                      className="h-10 touch-manipulation"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={inviteFormData.email}
                      onChange={(e) => setInviteFormData({ ...inviteFormData, email: e.target.value })}
                      required
                      placeholder="john@example.com"
                      className="h-10 touch-manipulation"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium">Role</Label>
                    <Select
                      value={inviteFormData.role}
                      onValueChange={(value) => setInviteFormData({ ...inviteFormData, role: value })}
                    >
                      <SelectTrigger className="h-10 touch-manipulation">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user" className="touch-manipulation">User</SelectItem>
                        <SelectItem value="project_manager" className="touch-manipulation">Project Manager</SelectItem>
                        <SelectItem value="business_development" className="touch-manipulation">Business Development</SelectItem>
                        <SelectItem value="manager" className="touch-manipulation">Manager</SelectItem>
                        {user?.role === "admin" && (
                          <SelectItem value="admin" className="touch-manipulation">Admin</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full h-10 touch-manipulation" disabled={inviting}>
                    {inviting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Invitation
                      </>
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
              )}
            </div>
          )}
        </div>

        {/* Select All */}
        {!loading && teamMembers.length > 0 && canManageTeam && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all-members"
              checked={selectedMembers.length === teamMembers.length}
              onCheckedChange={toggleSelectAll}
            />
            <label
              htmlFor="select-all-members"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Select All
            </label>
          </div>
        )}

        {/* Team Members Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : teamMembers.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Users className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No team members yet</h3>
              <p className="mt-2 text-center text-sm text-muted-foreground max-w-sm">
                Get started by inviting your first team member
              </p>
              {canManageTeam && (
                <Button className="mt-6" onClick={() => setInviteDialogOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite Team Member
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <Card
                key={member._id}
                className={`transition-all hover:shadow-md hover:border-primary/50 ${
                  member._id === user?._id ? "border-primary/30 bg-primary/5" : ""
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {canManageTeam && member._id !== user?._id && (
                      <Checkbox
                        checked={selectedMembers.includes(member._id)}
                        onCheckedChange={() => toggleSelectMember(member._id)}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-1"
                      />
                    )}
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                        {member.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-base truncate">{member.username}</h3>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                            <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                          </div>
                        </div>

                        {/* Actions Dropdown */}
                        {canEditMember(member) && member._id !== user?._id && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(member)} className="cursor-pointer">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(member)}
                                className="cursor-pointer text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 mt-3">
                        <Badge
                          variant={member.role === "admin" ? "default" : "secondary"}
                          className="text-xs h-6"
                        >
                          {member.role === "admin" && <Shield className="h-3 w-3 mr-1" />}
                          {formatRole(member.role)}
                        </Badge>
                        {member._id === user?._id && (
                          <Badge variant="outline" className="text-xs h-6">
                            You
                          </Badge>
                        )}
                        {member.isVerified && (
                          <Badge
                            variant="outline"
                            className="text-xs h-6 border-green-200 bg-green-50 text-green-700"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>

                      {member.invitedBy && (
                        <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                          <UserPlus className="h-3 w-3" />
                          Invited by {member.invitedBy}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-primary" />
                Edit Team Member
              </DialogTitle>
              <DialogDescription className="text-sm">
                Update member details and role
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-username" className="text-sm font-medium">Username</Label>
                <Input
                  id="edit-username"
                  type="text"
                  value={editFormData.username}
                  onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
                  required
                  className="h-10 touch-manipulation"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email" className="text-sm font-medium">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  required
                  className="h-10 touch-manipulation"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role" className="text-sm font-medium">Role</Label>
                <Select
                  value={editFormData.role}
                  onValueChange={(value) => setEditFormData({ ...editFormData, role: value })}
                >
                  <SelectTrigger className="h-10 touch-manipulation">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user" className="touch-manipulation">User</SelectItem>
                    <SelectItem value="project_manager" className="touch-manipulation">Project Manager</SelectItem>
                    <SelectItem value="business_development" className="touch-manipulation">Business Development</SelectItem>
                    <SelectItem value="manager" className="touch-manipulation">Manager</SelectItem>
                    {user?.role === "admin" && (
                      <SelectItem value="admin" className="touch-manipulation">Admin</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                  className="touch-manipulation"
                  disabled={updating}
                >
                  Cancel
                </Button>
                <Button type="submit" className="touch-manipulation" disabled={updating}>
                  {updating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Member"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete <strong>{selectedMember?.username}</strong> from your team.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Member"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Bulk Delete Dialog */}
        <AlertDialog
          open={showBulkDeleteDialog}
          onOpenChange={setShowBulkDeleteDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Multiple Team Members?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {selectedMembers.length} team member(s)? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleBulkDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Empty state when only 1 member */}
        {!loading && teamMembers.length === 1 && canManageTeam && (
          <Card className="border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-10">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <UserPlus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-4 text-base font-semibold">Grow your team</h3>
              <p className="mt-2 text-center text-sm text-muted-foreground max-w-sm">
                Invite team members to collaborate on projects
              </p>
              <Button
                className="mt-6 touch-manipulation"
                onClick={() => setInviteDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Invite Team Members
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
