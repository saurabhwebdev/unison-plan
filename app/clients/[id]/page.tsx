"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Edit, Trash2, Mail, Phone, Building2, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface Client {
  _id: string;
  name: string;
  companyName?: string;
  industry?: string;
  website?: string;
  primaryContact: {
    name: string;
    email: string;
    phone?: string;
    position?: string;
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  status: string;
  clientType: string;
  accountManager?: {
    username: string;
    email: string;
  };
  estimatedAnnualRevenue?: number;
  currency: string;
  notes?: string;
  tags: string[];
  createdAt: string;
}

const statusColors: Record<string, string> = {
  active: "bg-green-500/10 text-green-600",
  inactive: "bg-gray-500/10 text-gray-600",
  prospect: "bg-blue-500/10 text-blue-600",
  archived: "bg-red-500/10 text-red-600",
};

export default function ClientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      fetchClient();
    }
  }, [params?.id]);

  const fetchClient = async () => {
    try {
      const response = await fetch(`/api/clients/${params.id}`);
      const data = await response.json();

      if (data.success) {
        setClient(data.data);
      } else {
        toast.error("Failed to load client");
        router.push("/clients");
      }
    } catch (error) {
      toast.error("Error loading client");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full max-w-2xl" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!client) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold">{client.name}</h1>
            <Badge variant="secondary" className={statusColors[client.status]}>
              {client.status}
            </Badge>
          </div>
          {client.companyName && (
            <p className="text-muted-foreground mt-1">{client.companyName}</p>
          )}
        </div>
        <Button onClick={() => router.push(`/clients/${client._id}/edit`)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{client.primaryContact.name}</span>
              {client.primaryContact.position && (
                <span className="text-muted-foreground">
                  • {client.primaryContact.position}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{client.primaryContact.email}</span>
            </div>
            {client.primaryContact.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{client.primaryContact.phone}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Client Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type</span>
              <span className="font-medium">{client.clientType}</span>
            </div>
            {client.industry && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Industry</span>
                <span className="font-medium">{client.industry}</span>
              </div>
            )}
            {client.accountManager && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Manager</span>
                <span className="font-medium">{client.accountManager.username}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {client.notes && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{client.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
