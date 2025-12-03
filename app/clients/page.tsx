"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Plus,
  Search,
  Building2,
  Mail,
  Phone,
  User,
  LayoutGrid,
  List,
  Pencil,
  Trash2,
  MoreVertical,
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
import { Checkbox } from "@/components/ui/checkbox";

interface Client {
  _id: string;
  name: string;
  companyName?: string;
  industry?: string;
  primaryContact: {
    name: string;
    email: string;
    phone?: string;
    position?: string;
  };
  status: string;
  clientType: string;
  estimatedAnnualRevenue?: number;
  currency: string;
  createdAt: string;
  accountManager?: {
    username: string;
    email: string;
  };
}

const statusColors: Record<string, string> = {
  active: "bg-green-500/10 text-green-600 dark:text-green-400",
  inactive: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
  prospect: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  archived: "bg-red-500/10 text-red-600 dark:text-red-400",
};

const typeColors: Record<string, string> = {
  individual: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  small_business: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  enterprise: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  government: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
};

export default function ClientsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Client>>({});
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

  useEffect(() => {
    fetchClients();
  }, [statusFilter, typeFilter]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (searchQuery) params.append("search", searchQuery);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (typeFilter !== "all") params.append("clientType", typeFilter);

      const response = await fetch(`/api/clients?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setClients(data.data);
      } else {
        toast.error("Failed to fetch clients");
      }
    } catch (error) {
      toast.error("Error loading clients");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchClients();
  };

  const formatType = (type: string) => {
    return type
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

  const handleEdit = (client: Client, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingClient(client);
    setEditFormData(client);
  };

  const handleDelete = (client: Client, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingClient(client);
  };

  const confirmDelete = async () => {
    if (!deletingClient) return;

    try {
      const response = await fetch(`/api/clients/${deletingClient._id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Client deleted successfully");
        fetchClients();
        setDeletingClient(null);
      } else {
        toast.error(data.error || "Failed to delete client");
      }
    } catch (error) {
      toast.error("Error deleting client");
    }
  };

  const handleUpdateClient = async () => {
    if (!editingClient) return;

    try {
      const response = await fetch(`/api/clients/${editingClient._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Client updated successfully");
        fetchClients();
        setEditingClient(null);
        setEditFormData({});
      } else {
        toast.error(data.error || "Failed to update client");
      }
    } catch (error) {
      toast.error("Error updating client");
    }
  };

  const toggleSelectAll = () => {
    if (selectedClients.length === clients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(clients.map((c) => c._id));
    }
  };

  const toggleSelectClient = (clientId: string) => {
    setSelectedClients((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleBulkDelete = async () => {
    try {
      const deletePromises = selectedClients.map((id) =>
        fetch(`/api/clients/${id}`, { method: "DELETE" })
      );

      const results = await Promise.all(deletePromises);
      const allSuccessful = results.every((res) => res.ok);

      if (allSuccessful) {
        toast.success(`${selectedClients.length} client(s) deleted successfully`);
        setSelectedClients([]);
        fetchClients();
      } else {
        toast.error("Some clients could not be deleted");
      }
    } catch (error) {
      toast.error("Error deleting clients");
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
            <Skeleton key={i} className="h-56" />
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
            Clients
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {selectedClients.length > 0
              ? `${selectedClients.length} selected`
              : "Manage your client relationships"
            }
          </p>
        </div>
        <div className="flex gap-2">
          {selectedClients.length > 0 ? (
            <>
              <Button
                variant="outline"
                onClick={() => setSelectedClients([])}
              >
                <X className="h-4 w-4 mr-2" />
                Clear Selection
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowBulkDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete ({selectedClients.length})
              </Button>
            </>
          ) : (
            <Button onClick={() => router.push("/clients/new")}>
              <Plus className="h-4 w-4 mr-2" />
              New Client
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Clients</CardDescription>
            <CardTitle className="text-3xl">{clients.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-3xl">
              {clients.filter((c) => c.status === "active").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Prospects</CardDescription>
            <CardTitle className="text-3xl">
              {clients.filter((c) => c.status === "prospect").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Enterprise</CardDescription>
            <CardTitle className="text-3xl">
              {clients.filter((c) => c.clientType === "enterprise").length}
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
                placeholder="Search clients..."
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
            {clients.length > 0 && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all-clients"
                  checked={selectedClients.length === clients.length}
                  onCheckedChange={toggleSelectAll}
                />
                <label
                  htmlFor="select-all-clients"
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="prospect">Prospect</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-[160px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="small_business">Small Business</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="flex gap-1 border rounded-md p-1">
                <Button
                  size="sm"
                  variant={viewMode === "card" ? "secondary" : "ghost"}
                  onClick={() => setViewMode("card")}
                  className="h-8 w-8 p-0"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clients Grid/List */}
      {clients.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Building2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No clients found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get started by adding your first client
            </p>
            <Button onClick={() => router.push("/clients/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === "card" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <Card
              key={client._id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <Checkbox
                      checked={selectedClients.includes(client._id)}
                      onCheckedChange={() => toggleSelectClient(client._id)}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">
                        {client.name}
                      </CardTitle>
                      {client.companyName && (
                        <CardDescription className="mt-1">
                          {client.companyName}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={statusColors[client.status]}
                    >
                      {client.status}
                    </Badge>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => handleEdit(client, e)}
                        className="h-8 w-8 p-0"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => handleDelete(client, e)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{client.primaryContact.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{client.primaryContact.email}</span>
                </div>
                {client.primaryContact.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{client.primaryContact.phone}</span>
                  </div>
                )}

                <div className="pt-3 border-t space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Type</span>
                    <Badge
                      variant="secondary"
                      className={typeColors[client.clientType]}
                    >
                      {formatType(client.clientType)}
                    </Badge>
                  </div>
                  {client.industry && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Industry</span>
                      <span className="font-medium">{client.industry}</span>
                    </div>
                  )}
                  {client.accountManager && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Manager</span>
                      <span className="font-medium">
                        {client.accountManager.username}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {clients.map((client) => (
            <Card
              key={client._id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="py-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <Checkbox
                    checked={selectedClients.includes(client._id)}
                    onCheckedChange={() => toggleSelectClient(client._id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  {/* Main Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg truncate">
                        {client.name}
                      </h3>
                      <Badge
                        variant="secondary"
                        className={statusColors[client.status]}
                      >
                        {client.status}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={typeColors[client.clientType]}
                      >
                        {formatType(client.clientType)}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{client.primaryContact.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{client.primaryContact.email}</span>
                      </div>
                      {client.primaryContact.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{client.primaryContact.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="flex items-center gap-6 text-sm">
                    {client.industry && (
                      <div className="text-right">
                        <p className="text-muted-foreground text-xs">Industry</p>
                        <p className="font-medium">{client.industry}</p>
                      </div>
                    )}
                    {client.accountManager && (
                      <div className="text-right">
                        <p className="text-muted-foreground text-xs">Manager</p>
                        <p className="font-medium">{client.accountManager.username}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => handleEdit(client, e)}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => handleDelete(client, e)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingClient} onOpenChange={() => setEditingClient(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>
              Update client information below
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                value={editFormData.name || ""}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={editFormData.industry || ""}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, industry: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editFormData.status}
                  onValueChange={(value) =>
                    setEditFormData({ ...editFormData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="prospect">Prospect</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="clientType">Client Type</Label>
                <Select
                  value={editFormData.clientType}
                  onValueChange={(value) =>
                    setEditFormData({ ...editFormData, clientType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="small_business">Small Business</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="startup">Startup</SelectItem>
                    <SelectItem value="midmarket">Mid-Market</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Primary Contact</h4>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="contactName">Contact Name</Label>
                  <Input
                    id="contactName"
                    value={editFormData.primaryContact?.name || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        primaryContact: {
                          ...editFormData.primaryContact!,
                          name: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contactEmail">Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={editFormData.primaryContact?.email || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        primaryContact: {
                          ...editFormData.primaryContact!,
                          email: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="contactPhone">Phone</Label>
                    <Input
                      id="contactPhone"
                      value={editFormData.primaryContact?.phone || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          primaryContact: {
                            ...editFormData.primaryContact!,
                            phone: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="contactPosition">Position</Label>
                    <Input
                      id="contactPosition"
                      value={editFormData.primaryContact?.position || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          primaryContact: {
                            ...editFormData.primaryContact!,
                            position: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingClient(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateClient}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingClient} onOpenChange={() => setDeletingClient(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the client <strong>{deletingClient?.name}</strong>.
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
            <AlertDialogTitle>Delete Multiple Clients?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedClients.length} client(s)? This action cannot be undone.
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
