"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Calendar,
  Flag,
  CheckCircle2,
  Clock,
  AlertCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

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

export default function MyTasksPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Task>>({});

  useEffect(() => {
    fetchMyTasks();
  }, [statusFilter, priorityFilter]);

  const fetchMyTasks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (statusFilter !== "all") params.append("status", statusFilter);
      if (priorityFilter !== "all") params.append("priority", priorityFilter);

      const response = await fetch(`/api/tasks/my-tasks?${params.toString()}`);
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

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} days`;
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    return `Due in ${diffDays} days`;
  };

  const getDateColor = (dateString?: string) => {
    if (!dateString) return "text-muted-foreground";
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "text-red-500";
    if (diffDays <= 2) return "text-orange-500";
    return "text-muted-foreground";
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
        fetchMyTasks();
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
        fetchMyTasks();
        setEditingTask(null);
        setEditFormData({});
      } else {
        toast.error(data.error || "Failed to update task");
      }
    } catch (error) {
      toast.error("Error updating task");
    }
  };

  const getOverdueTasks = () => {
    return tasks.filter((task) => {
      if (!task.dueDate || task.status === "completed") return false;
      const date = new Date(task.dueDate);
      return date < new Date();
    });
  };

  const getDueSoonTasks = () => {
    return tasks.filter((task) => {
      if (!task.dueDate || task.status === "completed") return false;
      const date = new Date(task.dueDate);
      const today = new Date();
      const diffTime = date.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 3;
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
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
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          My Tasks
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Tasks assigned to you
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Total Tasks
            </CardDescription>
            <CardTitle className="text-3xl">{tasks.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              In Progress
            </CardDescription>
            <CardTitle className="text-3xl">
              {tasks.filter((t) => t.status === "in_progress").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              Overdue
            </CardDescription>
            <CardTitle className="text-3xl text-red-500">
              {getOverdueTasks().length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-orange-500" />
              Due Soon
            </CardDescription>
            <CardTitle className="text-3xl text-orange-500">
              {getDueSoonTasks().length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Completed
            </CardDescription>
            <CardTitle className="text-3xl text-green-500">
              {tasks.filter((t) => t.status === "completed").length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
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
              <SelectTrigger className="w-[180px]">
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
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No tasks assigned</h3>
            <p className="text-sm text-muted-foreground">
              You don't have any tasks assigned to you yet
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <Card key={task._id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-lg">
                            {task.title}
                          </h3>
                          <Badge
                            variant="secondary"
                            className={statusColors[task.status]}
                          >
                            {formatStatus(task.status)}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className={priorityColors[task.priority]}
                          >
                            <Flag className="h-3 w-3 mr-1" />
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {task.taskNumber} • {task.project?.name || 'Unknown Project'}
                        </p>
                      </div>
                    </div>

                    {task.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm">
                      <div
                        className={`flex items-center gap-1 ${getDateColor(
                          task.dueDate
                        )}`}
                      >
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(task.dueDate)}</span>
                      </div>
                      {task.estimatedHours && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{task.estimatedHours}h estimated</span>
                        </div>
                      )}
                    </div>

                    {/* Progress */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">
                          {task.progressPercentage}%
                        </span>
                      </div>
                      <Progress value={task.progressPercentage} className="h-2" />
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => handleEdit(task, e)}
                    >
                      <Pencil className="h-4 w-4 md:mr-2" />
                      <span className="hidden md:inline">Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => handleDelete(task, e)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 md:mr-2" />
                      <span className="hidden md:inline">Delete</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
            <div className="grid gap-2">
              <Label htmlFor="actualHours">Actual Hours</Label>
              <Input
                id="actualHours"
                type="number"
                min="0"
                value={editFormData.actualHours || 0}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    actualHours: parseFloat(e.target.value),
                  })
                }
              />
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
    </div>
  );
}
