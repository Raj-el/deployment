import React, { useMemo, useState, useEffect } from "react";
import {
  Users,
  Plus,
  Search,
  MoreHorizontal,
  UserPlus,
  Users2,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast"; // ← ADD THIS
import adminService, { UserSummary } from "@/services/adminService"; // ← ADD THIS

/* ---- App shell ---- */
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";

/* ---------------------------- Component ---------------------------- */
export function UserManagement() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminService.getUsers(false); // Only active users
      setUsers(response.users);
      console.log(`✅ Loaded ${response.users.length} active users`);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const lower = searchTerm.toLowerCase();
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(lower) ||
        u.name?.toLowerCase().includes(lower) ||
        u.primaryRole.toLowerCase().includes(lower)
    );
  }, [users, searchTerm]);

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get role badge variant
  const getRoleBadgeVariant = (role: string) => {
    if (role === "client_admin") return "default";
    if (role === "client_team") return "secondary";
    return "outline";
  };

  // Format role display name
  const formatRole = (role: string) => {
    if (role === "client_admin") return "ADMIN";
    if (role === "client_team") return "USER";
    return role.toUpperCase();
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <header className="h-14 border-b bg-white flex items-center px-4">
              <SidebarTrigger />
              <div className="ml-4">
                <h1 className="text-lg font-semibold">User Management</h1>
              </div>
            </header>
            <div className="flex-1 grid place-items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <header className="h-14 border-b bg-white flex items-center px-4">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-lg font-semibold">User Management</h1>
            </div>
          </header>

          {/* Main + Right rail */}
          <div className="flex-1 flex">
            {/* CENTER CONTENT */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1120px] px-6 py-6 font-['Poppins']">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Users</p>
                          <p className="text-3xl font-bold mt-1">
                            {users.length}
                          </p>
                        </div>
                        <Users className="h-10 w-10 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Active Users</p>
                          <p className="text-3xl font-bold mt-1">
                            {users.filter((u) => u.isActive).length}
                          </p>
                        </div>
                        <UserPlus className="h-10 w-10 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Admin Users</p>
                          <p className="text-3xl font-bold mt-1">
                            {
                              users.filter(
                                (u) => u.primaryRole === "client_admin"
                              ).length
                            }
                          </p>
                        </div>
                        <Users2 className="h-10 w-10 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Users Table */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="relative flex-1 max-w-md">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            placeholder="Search by name, email, or role..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add User
                      </Button>
                    </div>

                    <div className="rounded-lg border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Teams/Groups</TableHead>
                            <TableHead>Last Activity</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsers.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={6}
                                className="text-center py-8 text-gray-500"
                              >
                                {searchTerm
                                  ? "No users found matching your search"
                                  : "No users available"}
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredUsers.map((user) => (
                              <TableRow key={user.userId}>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">
                                      {user.name || "Not set"}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {user.email}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={getRoleBadgeVariant(
                                      user.primaryRole
                                    )}
                                  >
                                    {formatRole(user.primaryRole)}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-1">
                                    {user.roles.map((role, idx) => (
                                      <div key={idx} className="text-sm">
                                        {role.jobFunctionName || role.roleType}
                                      </div>
                                    ))}
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm text-gray-600">
                                  {formatDate(user.lastLoginAt)}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      user.isActive ? "default" : "secondary"
                                    }
                                  >
                                    {user.isActive ? "Active" : "Inactive"}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem>
                                        Edit User
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        View Details
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        Reset Password
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="text-red-600">
                                        Deactivate
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </main>

            {/* RIGHT RAIL */}
            <DataSourcePanel />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default UserManagement;
