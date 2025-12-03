"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  MoreVertical,
  Pencil,
  Trash2,
  Archive,
  FileText,
  CheckCircle2,
  Clock,
  Plus,
  Flag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface Project {
  _id: string;
  name: string;
  description?: string;
  projectCode: string;
  clientName: string;
  clientContact: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
  };
  stage: string;
  priority: string;
  progressPercentage: number;
  estimatedValue?: number;
  currency: string;
  startDate?: string;
  endDate?: string;
  projectManager?: {
    _id: string;
    username: string;
    email: string;
  };
  teamMembers: Array<{
    user: {
      _id: string;
      username: string;
      email: string;
    };
    role: string;
    assignedDate: string;
  }>;
  createdAt: string;
  updatedAt: string;
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

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [tasks, setTasks] = useState<any[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  useEffect(() => {
    if (activeTab === "tasks" && params.id) {
      fetchTasks();
    }
  }, [activeTab, params.id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${params.id}`);
      const data = await response.json();

      if (data.success) {
        setProject(data.data);
      } else {
        toast.error("Failed to fetch project");
        router.push("/projects");
      }
    } catch (error) {
      toast.error("Error loading project");
      router.push("/projects");
    } finally {
      setLoading(false);
    }
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const fetchTasks = async () => {
    try {
      setTasksLoading(true);
      const response = await fetch(`/api/tasks?project=${params.id}`);
      const data = await response.json();

      if (data.success) {
        setTasks(data.data);
      } else {
        toast.error("Failed to fetch tasks");
      }
    } catch (error) {
      toast.error("Error loading tasks");
    } finally {
      setTasksLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const response = await fetch(`/api/projects/${params.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Project deleted successfully");
        router.push("/projects");
      } else {
        toast.error("Failed to delete project");
      }
    } catch (error) {
      toast.error("Error deleting project");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Project not found</h2>
          <Button onClick={() => router.push("/projects")}>
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/projects")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {project.name}
              </h1>
              <Badge
                variant="secondary"
                className={stageColors[project.stage]}
              >
                {formatStage(project.stage)}
              </Badge>
              <Badge
                variant="secondary"
                className={priorityColors[project.priority]}
              >
                {project.priority}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {project.projectCode} " {project.clientName}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/projects/${project._id}/edit`)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Project
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDelete} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Estimated Value
            </CardDescription>
            <CardTitle className="text-2xl">
              {formatCurrency(project.estimatedValue, project.currency)}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Progress
            </CardDescription>
            <CardTitle className="text-2xl">
              {project.progressPercentage}%
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team Size
            </CardDescription>
            <CardTitle className="text-2xl">
              {project.teamMembers.length}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Status
            </CardDescription>
            <CardTitle className="text-xl">
              {formatStage(project.stage)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Overall Progress</span>
              <span className="text-muted-foreground">
                {project.progressPercentage}%
              </span>
            </div>
            <Progress value={project.progressPercentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 md:grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.description && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">
                      {project.description}
                    </p>
                  </div>
                )}
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Project Code</span>
                    <span className="font-medium">{project.projectCode}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Start Date</span>
                    <span className="font-medium">
                      {formatDate(project.startDate)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">End Date</span>
                    <span className="font-medium">
                      {formatDate(project.endDate)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Created</span>
                    <span className="font-medium">
                      {formatDate(project.createdAt)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Client Information */}
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Company</span>
                    <span className="font-medium">{project.clientName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Contact Name</span>
                    <span className="font-medium">
                      {project.clientContact.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium">
                      {project.clientContact.email}
                    </span>
                  </div>
                  {project.clientContact.phone && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Phone</span>
                      <span className="font-medium">
                        {project.clientContact.phone}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Project Manager */}
            {project.projectManager && (
              <Card>
                <CardHeader>
                  <CardTitle>Project Manager</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-medium">
                      {project.projectManager.username}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium">
                      {project.projectManager.email}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Team Members */}
            <Card>
              <CardHeader>
                <CardTitle>Team Members ({project.teamMembers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.teamMembers.length > 0 ? (
                    project.teamMembers.map((member, index) => (
                      <div
                        key={member.user?._id || index}
                        className="flex items-center justify-between py-2 border-b last:border-0"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {member.user?.username || 'Unknown'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {member.user?.email || 'No email'}
                          </p>
                        </div>
                        <Badge variant="outline">{member.role}</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No team members assigned
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="grid gap-1">
              <h3 className="text-lg font-semibold">Project Tasks</h3>
              <p className="text-sm text-muted-foreground">
                {tasks.length} task{tasks.length !== 1 ? 's' : ''} in this project
              </p>
            </div>
            <Button onClick={() => router.push(`/tasks/new?project=${project?._id}`)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>

          {tasksLoading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4 animate-pulse">
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Loading tasks...</p>
              </CardContent>
            </Card>
          ) : tasks.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your first task for this project
                </p>
                <Button onClick={() => router.push(`/tasks/new?project=${project?._id}`)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {tasks.map((task: any) => (
                <Card key={task._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold">{task.title}</h4>
                          <Badge
                            variant="secondary"
                            className={
                              task.status === "completed"
                                ? "bg-green-500/10 text-green-600"
                                : task.status === "in_progress"
                                ? "bg-blue-500/10 text-blue-600"
                                : task.status === "blocked"
                                ? "bg-red-500/10 text-red-600"
                                : "bg-slate-500/10 text-slate-600"
                            }
                          >
                            {task.status.replace("_", " ")}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className={
                              task.priority === "critical"
                                ? "bg-red-500/10 text-red-600"
                                : task.priority === "high"
                                ? "bg-orange-500/10 text-orange-600"
                                : task.priority === "medium"
                                ? "bg-blue-500/10 text-blue-600"
                                : "bg-slate-500/10 text-slate-600"
                            }
                          >
                            <Flag className="h-3 w-3 mr-1" />
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {task.taskNumber}
                          {task.assignedTo && ` • Assigned to ${task.assignedTo.username}`}
                        </p>
                        {task.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {task.dueDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(task.dueDate)}
                            </div>
                          )}
                          {task.estimatedHours && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {task.estimatedHours}h
                            </div>
                          )}
                          <div>{task.progressPercentage}% complete</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="grid gap-1">
              <h3 className="text-lg font-semibold">Team Members</h3>
              <p className="text-sm text-muted-foreground">
                {project?.teamMembers.length} member{project?.teamMembers.length !== 1 ? 's' : ''} assigned to this project
              </p>
            </div>
            {/* Future: Add Team Member button can go here */}
          </div>

          {project?.teamMembers && project.teamMembers.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {project.teamMembers.map((member) => (
                <Card key={member.user._id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-semibold">{member.user.username}</h4>
                          <p className="text-sm text-muted-foreground">{member.user.email}</p>
                          <div className="flex items-center gap-2 pt-1">
                            <Badge variant="secondary">{member.role}</Badge>
                            <span className="text-xs text-muted-foreground">
                              Since {new Date(member.assignedDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No team members yet</h3>
                <p className="text-sm text-muted-foreground">
                  Team members will appear here once assigned to the project
                </p>
              </CardContent>
            </Card>
          )}

          {project?.projectManager && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3">Project Manager</h4>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold">{project.projectManager.username}</h4>
                      <p className="text-sm text-muted-foreground">{project.projectManager.email}</p>
                      <Badge variant="default" className="mt-1">Project Manager</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardContent className="py-12 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Documents</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Document management coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardContent className="py-12 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Activity</h3>
              <p className="text-sm text-muted-foreground">
                Activity timeline will appear here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
