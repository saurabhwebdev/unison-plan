"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Plus,
  Search,
  Filter,
  Loader2,
  LayoutGrid,
  List,
  Pencil,
  Trash2,
  Calendar,
  User,
  Flag,
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

interface Task {
  _id: string;
  title: string;
  description?: string;
  taskNumber: string;
  status: "todo" | "in_progress" | "in_review" | "blocked" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "critical";
  project: {
    _id: string;
    name: string;
    projectCode: string;
  };
  assignedTo?: {
    _id: string;
    username: string;
    email: string;
  };
  createdBy: {
    _id: string;
    username: string;
    email: string;
  };
  dueDate?: string;
  progressPercentage: number;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const statusColors: Record<string, string> = {
  todo: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  in_progress: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  in_review: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  blocked: "bg-red-500/10 text-red-600 dark:text-red-400",
  completed: "bg-green-500/10 text-green-600 dark:text-green-400",
  cancelled: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
};

const priorityColors: Record<string, string> = {
  low: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  medium: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  high: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  critical: "bg-red-500/10 text-red-600 dark:text-red-400",
};

const statusColumns = [
  { id: "todo", label: "To Do" },
  { id: "in_progress", label: "In Progress" },
  { id: "in_review", label: "In Review" },
  { id: "blocked", label: "Blocked" },
  { id: "completed", label: "Completed" },
];

export default function TasksPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Task>>({});
  const [users, setUsers] = useState<any[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, [statusFilter, priorityFilter]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/team/list");
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (searchQuery) params.append("search", searchQuery);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (priorityFilter !== "all") params.append("priority", priorityFilter);

      const response = await fetch(`/api/tasks?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setTasks(data.data);
      } else {
        toast.error("Failed to fetch tasks");
      }
    } catch (error) {
      toast.error("Error loading tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchTasks();
  };

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No due date";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleEdit = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTask(task);
    setEditFormData(task);
  };

  const handleDelete = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingTask(task);
  };

  const confirmDelete = async () => {
    if (!deletingTask) return;

    try {
      const response = await fetch(`/api/tasks/${deletingTask._id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Task deleted successfully");
        fetchTasks();
        setDeletingTask(null);
      } else {
        toast.error(data.error || "Failed to delete task");
      }
    } catch (error) {
      toast.error("Error deleting task");
    }
  };

  const handleUpdateTask = async () => {
    if (!editingTask) return;

    try {
      const response = await fetch(`/api/tasks/${editingTask._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Task updated successfully");
        fetchTasks();
        setEditingTask(null);
        setEditFormData({});
      } else {
        toast.error(data.error || "Failed to update task");
      }
    } catch (error) {
      toast.error("Error updating task");
    }
  };

  const toggleSelectAll = () => {
    if (selectedTasks.length === tasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(tasks.map((t) => t._id));
    }
  };

  const toggleSelectTask = (taskId: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleBulkDelete = async () => {
    try {
      const deletePromises = selectedTasks.map((id) =>
        fetch(`/api/tasks/${id}`, { method: "DELETE" })
      );

      const results = await Promise.all(deletePromises);
      const allSuccessful = results.every((res) => res.ok);

      if (allSuccessful) {
        toast.success(`${selectedTasks.length} task(s) deleted successfully`);
        setSelectedTasks([]);
        fetchTasks();
      } else {
        toast.error("Some tasks could not be deleted");
      }
    } catch (error) {
      toast.error("Error deleting tasks");
    } finally {
      setShowBulkDeleteDialog(false);
    }
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
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
            Tasks
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {selectedTasks.length > 0
              ? `${selectedTasks.length} selected`
              : "Manage and track all project tasks"
            }
          </p>
        </div>
        <div className="flex gap-2">
          {selectedTasks.length > 0 ? (
            <>
              <Button
                variant="outline"
                onClick={() => setSelectedTasks([])}
              >
                <X className="h-4 w-4 mr-2" />
                Clear Selection
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowBulkDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete ({selectedTasks.length})
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => router.push("/my-tasks")}>
                <User className="h-4 w-4 mr-2" />
                My Tasks
              </Button>
              <Button onClick={() => router.push("/tasks/new")}>
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Tasks</CardDescription>
            <CardTitle className="text-3xl">{tasks.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>To Do</CardDescription>
            <CardTitle className="text-3xl">
              {tasks.filter((t) => t.status === "todo").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>In Progress</CardDescription>
            <CardTitle className="text-3xl">
              {tasks.filter((t) => t.status === "in_progress").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>In Review</CardDescription>
            <CardTitle className="text-3xl">
              {tasks.filter((t) => t.status === "in_review").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl">
              {tasks.filter((t) => t.status === "completed").length}
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
                placeholder="Search tasks..."
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
            {tasks.length > 0 && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all-tasks"
                  checked={selectedTasks.length === tasks.length}
                  onCheckedChange={toggleSelectAll}
                />
                <label
                  htmlFor="select-all-tasks"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Select All
                </label>
              </div>
            )}

            {/* Filters */}
            <div className="flex gap-2 flex-wrap md:flex-nowrap">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="in_review">In Review</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
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

              {/* View Toggle */}
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="rounded-r-none"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "kanban" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("kanban")}
                  className="rounded-l-none border-l"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List/Kanban */}
      {tasks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <LayoutGrid className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get started by creating your first task
            </p>
            <Button onClick={() => router.push("/tasks/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === "list" ? (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <Checkbox
                      checked={selectedTasks.includes(task._id)}
                      onCheckedChange={() => toggleSelectTask(task._id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">
                          {task.title}
                        </h3>
                        <Badge
                          variant="secondary"
                          className={statusColors[task.status]}
                        >
                          {formatStatus(task.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {task.taskNumber} • {task.project?.name || 'Unknown Project'}
                        {task.assignedTo && ` • Assigned to ${task.assignedTo.username}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(task.dueDate)}
                        </div>
                        <div className="font-medium mt-1">
                          {task.progressPercentage}% complete
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={priorityColors[task.priority]}
                      >
                        {task.priority}
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => handleEdit(task, e)}
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => handleDelete(task, e)}
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
      ) : (
        <div className="grid gap-4 md:grid-cols-5">
          {statusColumns.map((column) => {
            const columnTasks = getTasksByStatus(column.id);
            return (
              <Card key={column.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <span>{column.label}</span>
                    <Badge variant="secondary">{columnTasks.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {columnTasks.length > 0 ? (
                    columnTasks.map((task) => (
                      <Card key={task._id} className="p-3 hover:shadow-md transition-shadow">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2 flex-1">
                              <Checkbox
                                checked={selectedTasks.includes(task._id)}
                                onCheckedChange={() => toggleSelectTask(task._id)}
                                onClick={(e) => e.stopPropagation()}
                                className="mt-0.5"
                              />
                              <h4 className="text-sm font-medium line-clamp-2 flex-1">
                                {task.title}
                              </h4>
                            </div>
                            <Badge
                              variant="secondary"
                              className={priorityColors[task.priority]}
                            >
                              <Flag className="h-3 w-3" />
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {task.taskNumber}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {task.project?.name || 'Unknown Project'}
                          </div>
                          {task.assignedTo && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <User className="h-3 w-3" />
                              {task.assignedTo.username}
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(task.dueDate)}
                          </div>
                          <div className="flex gap-1 pt-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => handleEdit(task, e)}
                              className="h-6 px-2 text-xs"
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => handleDelete(task, e)}
                              className="h-6 px-2 text-xs text-destructive hover:text-destructive"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      No tasks
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update task information below
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                value={editFormData.title || ""}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, title: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editFormData.description || ""}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    description: e.target.value,
                  })
                }
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editFormData.status}
                  onValueChange={(value: any) =>
                    setEditFormData({ ...editFormData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="in_review">In Review</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={editFormData.priority}
                  onValueChange={(value: any) =>
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

            {/* Assign To */}
            <div className="grid gap-2">
              <Label htmlFor="assignedTo">Assign To</Label>
              <Select
                value={editFormData.assignedTo?._id || editFormData.assignedTo || "unassigned"}
                onValueChange={(value: any) =>
                  setEditFormData({ ...editFormData, assignedTo: value === "unassigned" ? null : value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a team member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user._id} value={user._id}>
                      {user.username} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Due Date and Hours */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={editFormData.dueDate ? new Date(editFormData.dueDate).toISOString().split('T')[0] : ""}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, dueDate: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="estimatedHours">Estimated Hours</Label>
                <Input
                  id="estimatedHours"
                  type="number"
                  min="0"
                  step="0.5"
                  value={editFormData.estimatedHours || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      estimatedHours: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            {/* Actual Hours and Tags */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="actualHours">Actual Hours</Label>
                <Input
                  id="actualHours"
                  type="number"
                  min="0"
                  step="0.5"
                  value={editFormData.actualHours || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      actualHours: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={Array.isArray(editFormData.tags) ? editFormData.tags.join(", ") : ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      tags: e.target.value.split(",").map(tag => tag.trim()),
                    })
                  }
                  placeholder="Enter tags separated by commas"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTask(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTask}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingTask}
        onOpenChange={() => setDeletingTask(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the task{" "}
              <strong>{deletingTask?.title}</strong>. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
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
            <AlertDialogTitle>Delete Multiple Tasks?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedTasks.length} task(s)? This action cannot be undone.
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
