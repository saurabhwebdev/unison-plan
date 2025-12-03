"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface User {
  _id: string;
  username: string;
  email: string;
}

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [teamMembers, setTeamMembers] = useState<Array<{ user: string; role: string }>>([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    projectCode: "",
    clientName: "",
    clientContactName: "",
    clientContactEmail: "",
    clientContactPhone: "",
    clientContactCompany: "",
    stage: "lead",
    priority: "medium",
    currency: "USD",
    estimatedValue: "",
    actualValue: "",
    budget: "",
    actualSpend: "",
    bidProbability: "",
    estimatedDuration: "",
    progressPercentage: "",
    projectManager: "",
    businessDevelopmentLead: "",
    tags: "",
    category: "",
  });

  useEffect(() => {
    fetchUsers();
    if (params?.id) {
      fetchProject();
    }
  }, [params?.id]);

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

  const fetchProject = async () => {
    try {
      setPageLoading(true);
      const response = await fetch(`/api/projects/${params.id}`);
      const data = await response.json();

      if (data.success) {
        const project = data.data;
        setFormData({
          name: project.name || "",
          description: project.description || "",
          projectCode: project.projectCode || "",
          clientName: project.clientName || "",
          clientContactName: project.clientContact?.name || "",
          clientContactEmail: project.clientContact?.email || "",
          clientContactPhone: project.clientContact?.phone || "",
          clientContactCompany: project.clientContact?.company || "",
          stage: project.stage || "lead",
          priority: project.priority || "medium",
          currency: project.currency || "USD",
          estimatedValue: project.estimatedValue?.toString() || "",
          actualValue: project.actualValue?.toString() || "",
          budget: project.budget?.toString() || "",
          actualSpend: project.actualSpend?.toString() || "",
          bidProbability: project.bidProbability?.toString() || "",
          estimatedDuration: project.estimatedDuration?.toString() || "",
          progressPercentage: project.progressPercentage?.toString() || "0",
          projectManager: project.projectManager?._id || "",
          businessDevelopmentLead: project.businessDevelopmentLead?._id || "",
          tags: project.tags?.join(", ") || "",
          category: project.category || "",
        });

        // Set team members
        if (project.teamMembers && project.teamMembers.length > 0) {
          setTeamMembers(
            project.teamMembers.map((tm: any) => ({
              user: tm.user?._id || tm.user,
              role: tm.role,
            }))
          );
        }
      } else {
        toast.error("Failed to load project");
        router.push("/projects");
      }
    } catch (error) {
      toast.error("Error loading project");
      router.push("/projects");
    } finally {
      setPageLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, { user: "", role: "" }]);
  };

  const removeTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const updateTeamMember = (index: number, field: "user" | "role", value: string) => {
    const updated = [...teamMembers];
    updated[index][field] = value;
    setTeamMembers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (
        !formData.name ||
        !formData.clientName ||
        !formData.clientContactName ||
        !formData.clientContactEmail
      ) {
        toast.error("Please fill in all required fields");
        setLoading(false);
        return;
      }

      // Prepare data
      const projectData = {
        name: formData.name,
        description: formData.description || undefined,
        projectCode: formData.projectCode,
        clientName: formData.clientName,
        clientContact: {
          name: formData.clientContactName,
          email: formData.clientContactEmail,
          phone: formData.clientContactPhone || undefined,
          company: formData.clientContactCompany || undefined,
        },
        stage: formData.stage,
        priority: formData.priority,
        currency: formData.currency,
        estimatedValue: formData.estimatedValue
          ? parseFloat(formData.estimatedValue)
          : undefined,
        actualValue: formData.actualValue
          ? parseFloat(formData.actualValue)
          : undefined,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        actualSpend: formData.actualSpend
          ? parseFloat(formData.actualSpend)
          : undefined,
        bidProbability: formData.bidProbability
          ? parseInt(formData.bidProbability)
          : undefined,
        estimatedDuration: formData.estimatedDuration
          ? parseInt(formData.estimatedDuration)
          : undefined,
        progressPercentage: formData.progressPercentage
          ? parseInt(formData.progressPercentage)
          : 0,
        projectManager: formData.projectManager || undefined,
        businessDevelopmentLead: formData.businessDevelopmentLead || undefined,
        teamMembers: teamMembers.filter(tm => tm.user && tm.role).map(tm => ({
          user: tm.user,
          role: tm.role,
          assignedDate: new Date(),
        })),
        tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim())
          : [],
        category: formData.category || undefined,
      };

      const response = await fetch(`/api/projects/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Project updated successfully!");
        router.push(`/projects/${params.id}`);
      } else {
        toast.error(data.error || "Failed to update project");
      }
    } catch (error) {
      toast.error("Error updating project");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Edit Project
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Update project information
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Project name, description, and code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Project Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter project name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectCode">
                    Project Code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="projectCode"
                    name="projectCode"
                    value={formData.projectCode}
                    onChange={handleChange}
                    placeholder="PRJ-2025-0001"
                    required
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter project description"
                  rows={4}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g., Web Development, Mobile App"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="e.g., urgent, enterprise, saas"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
              <CardDescription>Details about the client</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">
                  Client Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="clientName"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  placeholder="Enter client/company name"
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="clientContactName">
                    Contact Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="clientContactName"
                    name="clientContactName"
                    value={formData.clientContactName}
                    onChange={handleChange}
                    placeholder="Contact person name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientContactEmail">
                    Contact Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="clientContactEmail"
                    name="clientContactEmail"
                    type="email"
                    value={formData.clientContactEmail}
                    onChange={handleChange}
                    placeholder="contact@client.com"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="clientContactPhone">Contact Phone</Label>
                  <Input
                    id="clientContactPhone"
                    name="clientContactPhone"
                    value={formData.clientContactPhone}
                    onChange={handleChange}
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientContactCompany">Company</Label>
                  <Input
                    id="clientContactCompany"
                    name="clientContactCompany"
                    value={formData.clientContactCompany}
                    onChange={handleChange}
                    placeholder="Company name"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>
                Stage, priority, and financial info
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="stage">Stage</Label>
                  <Select
                    value={formData.stage}
                    onValueChange={(value) =>
                      setFormData({ ...formData, stage: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="pre_bid">Pre Bid</SelectItem>
                      <SelectItem value="bid_submitted">
                        Bid Submitted
                      </SelectItem>
                      <SelectItem value="negotiation">Negotiation</SelectItem>
                      <SelectItem value="won">Won</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="on_hold">On Hold</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) =>
                      setFormData({ ...formData, priority: value })
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

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) =>
                      setFormData({ ...formData, currency: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="INR">INR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="estimatedValue">Estimated Value</Label>
                  <Input
                    id="estimatedValue"
                    name="estimatedValue"
                    type="number"
                    value={formData.estimatedValue}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actualValue">Actual Value</Label>
                  <Input
                    id="actualValue"
                    name="actualValue"
                    type="number"
                    value={formData.actualValue}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget</Label>
                  <Input
                    id="budget"
                    name="budget"
                    type="number"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actualSpend">Actual Spend</Label>
                  <Input
                    id="actualSpend"
                    name="actualSpend"
                    type="number"
                    value={formData.actualSpend}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedDuration">Duration (days)</Label>
                  <Input
                    id="estimatedDuration"
                    name="estimatedDuration"
                    type="number"
                    value={formData.estimatedDuration}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="progressPercentage">Progress (%)</Label>
                  <Input
                    id="progressPercentage"
                    name="progressPercentage"
                    type="number"
                    value={formData.progressPercentage}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    max="100"
                  />
                </div>
                {(formData.stage === "pre_bid" ||
                  formData.stage === "bid_submitted") && (
                  <div className="space-y-2">
                    <Label htmlFor="bidProbability">
                      Bid Win Probability (%)
                    </Label>
                    <Input
                      id="bidProbability"
                      name="bidProbability"
                      type="number"
                      value={formData.bidProbability}
                      onChange={handleChange}
                      placeholder="0-100"
                      min="0"
                      max="100"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Team Assignment */}
          <Card>
            <CardHeader>
              <CardTitle>Team Assignment</CardTitle>
              <CardDescription>
                Assign team members to the project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="businessDevelopmentLead">
                    Business Development Lead
                  </Label>
                  <Select
                    value={formData.businessDevelopmentLead || undefined}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        businessDevelopmentLead: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select BD Lead" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((u) => (
                        <SelectItem key={u._id} value={u._id}>
                          {u.username} ({u.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectManager">Project Manager</Label>
                  <Select
                    value={formData.projectManager || undefined}
                    onValueChange={(value) =>
                      setFormData({ ...formData, projectManager: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Project Manager" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((u) => (
                        <SelectItem key={u._id} value={u._id}>
                          {u.username} ({u.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Additional Team Members */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Additional Team Members</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTeamMember}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </div>

                {teamMembers.length > 0 && (
                  <div className="space-y-3">
                    {teamMembers.map((member, index) => (
                      <div key={index} className="flex gap-3 items-end">
                        <div className="flex-1 space-y-2">
                          <Label>Team Member</Label>
                          <Select
                            value={member.user || undefined}
                            onValueChange={(value) =>
                              updateTeamMember(index, "user", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select team member" />
                            </SelectTrigger>
                            <SelectContent>
                              {users.map((u) => (
                                <SelectItem key={u._id} value={u._id}>
                                  {u.username} ({u.email})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex-1 space-y-2">
                          <Label>Role</Label>
                          <Input
                            placeholder="e.g., Developer, Designer, QA"
                            value={member.role}
                            onChange={(e) =>
                              updateTeamMember(index, "role", e.target.value)
                            }
                          />
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTeamMember(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {teamMembers.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No additional team members added yet. Click "Add Member" to assign team members to this project.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Project
            </Button>
          </div>
        </form>
    </div>
  );
}
