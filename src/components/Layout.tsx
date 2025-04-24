import { ReactNode } from "react";
import { CircleDollarSign, Home, PieChart, Users, LogOut, User, Shield } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  // Get current route to highlight active navigation items
  const location = useLocation();
  const { user, logout } = useAuth();
  
  // Check if current user is admin - this would be implementation-specific
  // In this mock version, we're just checking if the email contains 'admin'
  const isAdmin = user?.email.includes("admin");
  
  // Navigation items used in both sidebar and mobile navigation
  const mainNavItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Add Expense",
      href: "/add",
      icon: <CircleDollarSign className="h-5 w-5" />,
    },
    {
      title: "Manage Budgets",
      href: "/budget",
      icon: <PieChart className="h-5 w-5" />,
    },
    {
      title: "Reports",
      href: "/reports",
      icon: <PieChart className="h-5 w-5" />,
    },
    {
      title: "Accountants",
      href: "/accountants",
      icon: <Users className="h-5 w-5" />,
    },
  ];

  // Add admin panel to navigation if user is admin
  const navItems = isAdmin
    ? [
        ...mainNavItems,
        {
          title: "Admin Panel",
          href: "/admin",
          icon: <Shield className="h-5 w-5" />,
        },
      ]
    : mainNavItems;

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:flex flex-col bg-sidebar w-64 p-4 text-sidebar-foreground">
        <div className="flex items-center gap-2 py-4 px-2 mb-6">
          <CircleDollarSign className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">ExpenseTracker</span>
        </div>
        
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent",
                location.pathname === item.href
                  ? "bg-sidebar-accent text-primary"
                  : "text-sidebar-foreground hover:text-sidebar-foreground"
              )}
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
        
        {/* User profile section */}
        <div className="mt-auto pt-4 border-t border-sidebar-border">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent">
                  <User className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Mobile bottom navigation - visible only on mobile */}
      <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 md:hidden">
        <div className={`grid h-full ${isAdmin ? 'grid-cols-5' : 'grid-cols-4'}`}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center",
                location.pathname === item.href
                  ? "text-primary"
                  : "text-gray-500 hover:text-primary"
              )}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto pb-16 md:pb-0">
        <div className="flex justify-end items-center p-4 border-b md:hidden">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  {user.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <main className="container max-w-screen-xl mx-auto py-6 px-4 md:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
