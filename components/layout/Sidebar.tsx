"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  Building2,
  CheckSquare,
  ClipboardList,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Projects",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    name: "Clients",
    href: "/clients",
    icon: Building2,
  },
  {
    name: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    name: "Team",
    href: "/team",
    icon: Users,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps = {}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { isCollapsed, toggleCollapsed } = useSidebar();

  const handleLogout = () => {
    onNavigate?.();
    logout();
  };

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r bg-background transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo/Brand */}
      <div className={cn(
        "flex h-16 items-center border-b",
        isCollapsed ? "justify-center" : "px-6"
      )}>
        {!isCollapsed ? (
          <Link href="/dashboard" className="flex items-center space-x-2 transition-smooth hover-scale">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary transition-smooth">
              <span className="text-lg font-bold text-primary-foreground">PT</span>
            </div>
            <span className="text-lg font-semibold">Project Tracker</span>
          </Link>
        ) : (
          <Link href="/dashboard">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary transition-smooth hover-scale">
              <span className="text-lg font-bold text-primary-foreground">PT</span>
            </div>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => onNavigate?.()}
                title={isCollapsed ? item.name : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 sm:py-2 text-base sm:text-sm font-medium transition-smooth touch-manipulation",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  isCollapsed && "justify-center"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Collapse Toggle */}
      <div className="px-3 py-2">
        <Button
          variant="outline"
          size={isCollapsed ? "icon" : "default"}
          onClick={toggleCollapsed}
          className={cn(
            "transition-smooth",
            isCollapsed ? "w-full" : "w-full justify-start"
          )}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Collapse
            </>
          )}
        </Button>
      </div>

      {/* User Section */}
      <div className="border-t p-4">
        {!isCollapsed ? (
          <>
            <div className="mb-3 flex items-center gap-3 rounded-lg p-2 -m-2 cursor-pointer transition-smooth hover:bg-accent/50">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 transition-smooth hover:bg-primary/20 flex-shrink-0">
                <span className="text-sm font-semibold text-primary">
                  {user?.username?.substring(0, 2).toUpperCase() || "US"}
                </span>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">{user?.username}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {user?.role}
                </p>
              </div>
            </div>
            <Separator className="mb-3" />
            <Button
              variant="ghost"
              className="w-full justify-start transition-smooth h-11 text-base sm:text-sm sm:h-10 touch-manipulation"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 transition-smooth hover:bg-primary/20 cursor-pointer"
              title={user?.username || "User"}
            >
              <span className="text-sm font-semibold text-primary">
                {user?.username?.substring(0, 2).toUpperCase() || "US"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="transition-smooth touch-manipulation"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
