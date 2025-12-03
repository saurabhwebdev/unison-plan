"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Plus,
  Search,
  Grid3x3,
  List,
  Filter,
  Loader2,
  Archive,
  LayoutGrid,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface Project {
  _id: string;
  name: string;
  description?: string;
  projectCode: string;
  clientName: string;
  stage: string;
  priority: string;
  progressPercentage: number;
  estimatedValue?: number;
  currency: string;
  createdAt: string;
  projectManager?: {
    username: string;
    email: string;
  };
  teamMembers: any[];
}

const stageColors: Record<string, string> = {
  lead: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  pre_bid: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  bid_submitted: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  negotiation: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  won: "bg-green-500/10 text-green-600 dark:text-green-400",
  in_progress: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  on_hold: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  lost: "bg-red-500/10 text-red-600 dark:text-red-400",
  cancelled: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
};

const priorityColors: Record<string, string> = {
  low: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  medium: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  high: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  critical: "bg-red-500/10 text-red-600 dark:text-red-400",
};

export default function ProjectsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("active");
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Project>>({});
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [stageFilter, priorityFilter, statusFilter]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (searchQuery) params.append("search", searchQuery);
      if (stageFilter !== "all") params.append("stage", stageFilter);
      if (priorityFilter !== "all") params.append("priority", priorityFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);

      const response = await fetch(`/api/projects?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setProjects(data.data);
      } else {
        toast.error("Failed to fetch projects");
      }
    } catch (error) {
      toast.error("Error loading projects");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchProjects();
  };

  const formatStage = (stage: string) => {
    return stage
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatCurrency = (value?: number, currency?: string) => {
    if (!value) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleEdit = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProject(project);
    setEditFormData(project);
  };

  const handleDelete = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingProject(project);
  };

  const confirmDelete = async () => {
    if (!deletingProject) return;

    try {
      const response = await fetch(`/api/projects/${deletingProject._id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Project deleted successfully");
        fetchProjects();
        setDeletingProject(null);
      } else {
        toast.error(data.error || "Failed to delete project");
      }
    } catch (error) {
      toast.error("Error deleting project");
    }
  };

  const handleUpdateProject = async () => {
    if (!editingProject) return;

    try {
      const response = await fetch(`/api/projects/${editingProject._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Project updated successfully");
        fetchProjects();
        setEditingProject(null);
        setEditFormData({});
      } else {
        toast.error(data.error || "Failed to update project");
      }
    } catch (error) {
      toast.error("Error updating project");
    }
  };

  const toggleSelectAll = () => {
    if (selectedProjects.length === projects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(projects.map((p) => p._id));
    }
  };

  const toggleSelectProject = (projectId: string) => {
    setSelectedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleBulkDelete = async () => {
    try {
      const deletePromises = selectedProjects.map((id) =>
        fetch(`/api/projects/${id}`, { method: "DELETE" })
      );

      const results = await Promise.all(deletePromises);
      const allSuccessful = results.every((res) => res.ok);

      if (allSuccessful) {
        toast.success(`${selectedProjects.length} project(s) deleted successfully`);
        setSelectedProjects([]);
        fetchProjects();
      } else {
        toast.error("Some projects could not be deleted");
      }
    } catch (error) {
      toast.error("Error deleting projects");
    } finally {
      setShowBulkDeleteDialog(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Projects
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedProjects.length > 0
                ? `${selectedProjects.length} selected`
                : "Manage and track all your projects"
              }
            </p>
          </div>
          <div className="flex gap-2">
            {selectedProjects.length > 0 ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setSelectedProjects([])}
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Selection
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setShowBulkDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete ({selectedProjects.length})
                </Button>
              </>
            ) : (
              <Button onClick={() => router.push("/projects/new")}>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Projects</CardDescription>
              <CardTitle className="text-3xl">{projects.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>In Progress</CardDescription>
              <CardTitle className="text-3xl">
                {
                  projects.filter((p) => p.stage === "in_progress").length
                }
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Completed</CardDescription>
              <CardTitle className="text-3xl">
                {projects.filter((p) => p.stage === "completed").length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Value</CardDescription>
              <CardTitle className="text-3xl">
                {formatCurrency(
                  projects.reduce((sum, p) => sum + (p.estimatedValue || 0), 0),
                  "USD"
                )}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1"
                />
                <Button onClick={handleSearch} variant="secondary">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {/* Select All */}
              {projects.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all"
                    checked={selectedProjects.length === projects.length}
                    onCheckedChange={toggleSelectAll}
                  />
                  <label
                    htmlFor="select-all"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Select All
                  </label>
                </div>
              )}

              {/* Filters */}
              <div className="flex gap-2 flex-wrap md:flex-nowrap">
                <Select value={stageFilter} onValueChange={setStageFilter}>
                  <SelectTrigger className="w-full md:w-[140px]">
                    <SelectValue placeholder="Stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="pre_bid">Pre Bid</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={priorityFilter}
                  onValueChange={setPriorityFilter}
                >
                  <SelectTrigger className="w-full md:w-[140px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Toggle */}
                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none border-l"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid/List */}
        {projects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <LayoutGrid className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No projects found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get started by creating your first project
              </p>
              <Button onClick={() => router.push("/projects/new")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </CardContent>
          </Card>
        ) : viewMode === "grid" ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card
                key={project._id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/projects/${project._id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <Checkbox
                        checked={selectedProjects.includes(project._id)}
                        onCheckedChange={() => toggleSelectProject(project._id)}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">
                          {project.name}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {project.projectCode}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={priorityColors[project.priority]}
                      >
                        {project.priority}
                      </Badge>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => handleEdit(project, e)}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => handleDelete(project, e)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Client</span>
                      <span className="font-medium truncate ml-2">
                        {project.clientName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Stage</span>
                      <Badge
                        variant="secondary"
                        className={stageColors[project.stage]}
                      >
                        {formatStage(project.stage)}
                      </Badge>
                    </div>
                    {project.estimatedValue && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Value</span>
                        <span className="font-medium">
                          {formatCurrency(
                            project.estimatedValue,
                            project.currency
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {project.progressPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${project.progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  {project.projectManager && (
                    <div className="flex items-center gap-2 text-sm pt-2 border-t">
                      <span className="text-muted-foreground">PM:</span>
                      <span className="font-medium">
                        {project.projectManager.username}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/projects/${project._id}`)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <Checkbox
                        checked={selectedProjects.includes(project._id)}
                        onCheckedChange={() => toggleSelectProject(project._id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">
                            {project.name}
                          </h3>
                          <Badge
                            variant="secondary"
                            className={stageColors[project.stage]}
                          >
                            {formatStage(project.stage)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {project.projectCode} • {project.clientName}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-right">
                          <div className="font-medium">
                            {formatCurrency(
                              project.estimatedValue,
                              project.currency
                            )}
                          </div>
                          <div className="text-muted-foreground">
                            {project.progressPercentage}% complete
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className={priorityColors[project.priority]}
                        >
                          {project.priority}
                        </Badge>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => handleEdit(project, e)}
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => handleDelete(project, e)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Edit Dialog */}
      <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update project information below
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={editFormData.name || ""}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editFormData.description || ""}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="stage">Stage</Label>
                <Select
                  value={editFormData.stage}
                  onValueChange={(value) =>
                    setEditFormData({ ...editFormData, stage: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="pre_bid">Pre Bid</SelectItem>
                    <SelectItem value="bid_submitted">Bid Submitted</SelectItem>
                    <SelectItem value="negotiation">Negotiation</SelectItem>
                    <SelectItem value="won">Won</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={editFormData.priority}
                  onValueChange={(value) =>
                    setEditFormData({ ...editFormData, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="estimatedValue">Estimated Value</Label>
                <Input
                  id="estimatedValue"
                  type="number"
                  value={editFormData.estimatedValue || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      estimatedValue: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="progressPercentage">Progress (%)</Label>
                <Input
                  id="progressPercentage"
                  type="number"
                  min="0"
                  max="100"
                  value={editFormData.progressPercentage || 0}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      progressPercentage: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingProject(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProject}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingProject} onOpenChange={() => setDeletingProject(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the project <strong>{deletingProject?.name}</strong>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
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
            <AlertDialogTitle>Delete Multiple Projects?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedProjects.length} project(s)? This action cannot be undone.
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
    </div>
  );
}
