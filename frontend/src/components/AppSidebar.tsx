//===============================2nd EDIT========================================
import React, { useMemo, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LogOut,
  LayoutDashboard,
  Target,
  BarChart3,
  FileText,
  MessageSquare,
  Settings,
  HelpCircle,
  Shield,
  Library as LibraryIcon,
  HeartHandshake,
  Brain,
  MessageCircle,
  Activity,
  Folder,
  Building2,
  Headphones,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import authService from "@/services/authService"; // ← ADD THIS

type NavItem = { title: string; url: string; icon: React.ElementType };

// Everything that must appear BEFORE "Customer Value"
const topBeforeCV: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Library", url: "/library", icon: LibraryIcon },
  {
    title: "Account Intake and Setup",
    url: "/account-intake",
    icon: Target,
  },
];

// Children inside "Customer Value"
const customerValueChildren: NavItem[] = [
  { title: "Health Scores", url: "/health-scores", icon: Activity },
  { title: "Get-Well Plans", url: "/get-well-plans", icon: HeartHandshake },
  { title: "CS Query", url: "/cs-query", icon: MessageCircle },
  { title: "Customer Management", url: "/customers", icon: Building2 },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Messages", url: "/messages", icon: MessageSquare },
];

// Children inside "Onboarding"
const onboardingChildren: NavItem[] = [
  { title: "Onboarding", url: "/onboarding", icon: GraduationCap },
  { title: "Projects", url: "/projects", icon: Folder },
];

// Everything that must appear AFTER "Customer Value"
const topAfterCV: NavItem[] = [
  { title: "Technical Support", url: "/support", icon: Headphones },
  { title: "Experts", url: "/expert-dashboard", icon: Brain },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const collapsed = state === "collapsed";
  const isActive = (path: string) => location.pathname.startsWith(path);

  // ← ADD THIS: Check if user is admin
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    const userType = currentUser?.type;
    // Admin types: 'superadmin' or 'client_admin'
    setIsAdmin(userType === "superadmin" || userType === "client_admin");
  }, []);

  // auto-open Customer Value if any child is active
  const customerValueChildActive = useMemo(
    () =>
      customerValueChildren.some((c) => location.pathname.startsWith(c.url)),
    [location.pathname]
  );
  const [cvOpen, setCvOpen] = useState(customerValueChildActive);
  useEffect(
    () => setCvOpen(customerValueChildActive),
    [customerValueChildActive]
  );

  // auto-open Onboarding if any child is active
  const onboardingChildActive = useMemo(
    () => onboardingChildren.some((c) => isActive(c.url)),
    [location.pathname]
  );
  const [onOpen, setOnOpen] = useState(onboardingChildActive);
  useEffect(() => setOnOpen(onboardingChildActive), [onboardingChildActive]);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("remember");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <Sidebar
      className={cn(
        "transition-all duration-300 border-r bg-white",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Brand */}
      <div className={cn("border-b", collapsed ? "px-2 py-3" : "px-4 py-4")}>
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">AD</span>
            </div>
            <span className="font-semibold text-lg tracking-tight">
              Accendo
            </span>
          </div>
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto shadow-sm">
            <span className="text-white font-bold text-sm">CS</span>
          </div>
        )}
      </div>

      {/* Make the whole content a flex column so footer can stick to the bottom */}
      <SidebarContent
        className={cn(
          "p-2 text-[15px] flex flex-col h-full",
          collapsed && "px-1"
        )}
      >
        {/* TOP SECTION */}
        <SidebarMenu className="space-y-1">
          {topBeforeCV.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className={cn(
                  "w-full justify-start rounded-xl px-3 py-2 transition-colors",
                  "hover:bg-slate-100 hover:text-slate-900",
                  isActive(item.url) &&
                    "bg-cyan-100 text-slate-900 shadow-[inset_0_0_0_1px_rgba(14,165,233,0.25)]"
                )}
              >
                <Link to={item.url} className="flex items-center gap-3">
                  <item.icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0",
                      isActive(item.url) ? "text-slate-900" : "text-slate-500"
                    )}
                  />
                  {!collapsed && (
                    <span
                      className={cn(
                        "truncate",
                        isActive(item.url) && "font-medium"
                      )}
                    >
                      {item.title}
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          {/* ONBOARDING (collapsible, like Customer Value) */}
          <SidebarMenuItem>
            <button
              type="button"
              onClick={() => setOnOpen((v) => !v)}
              className={cn(
                "w-full flex items-center gap-3 rounded-xl px-3 py-2",
                "hover:bg-slate-100 hover:text-slate-900 transition-colors",
                onboardingChildActive &&
                  "bg-cyan-100 text-slate-900 shadow-[inset_0_0_0_1px_rgba(14,165,233,0.25)]"
              )}
            >
              <GraduationCap className="h-5 w-5 text-slate-600" />
              {!collapsed && (
                <span
                  className={cn(
                    "truncate",
                    onboardingChildActive && "font-medium"
                  )}
                >
                  Onboarding
                </span>
              )}
            </button>

            {onOpen && (
              <div className="mt-1 pl-8 space-y-1">
                {onboardingChildren.map((item) => (
                  <SidebarMenuButton
                    key={item.title}
                    asChild
                    className={cn(
                      "w-full justify-start rounded-lg px-3 py-2",
                      "hover:bg-slate-100 hover:text-slate-900 transition-colors",
                      isActive(item.url) && "bg-cyan-100 text-slate-900"
                    )}
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon
                        className={cn(
                          "h-4 w-4 flex-shrink-0",
                          isActive(item.url)
                            ? "text-slate-900"
                            : "text-slate-500"
                        )}
                      />
                      {!collapsed && (
                        <span className="truncate">{item.title}</span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                ))}
              </div>
            )}
          </SidebarMenuItem>

          {/* CUSTOMER VALUE (collapsible) */}
          <SidebarMenuItem>
            <button
              type="button"
              onClick={() => setCvOpen((v) => !v)}
              className={cn(
                "w-full flex items-center gap-3 rounded-xl px-3 py-2",
                "hover:bg-slate-100 hover:text-slate-900 transition-colors",
                customerValueChildActive &&
                  "bg-cyan-100 text-slate-900 shadow-[inset_0_0_0_1px_rgba(14,165,233,0.25)]"
              )}
            >
              <GraduationCap className="h-5 w-5 text-slate-600" />
              {!collapsed && (
                <span
                  className={cn(
                    "truncate",
                    customerValueChildActive && "font-medium"
                  )}
                >
                  Customer Value
                </span>
              )}
            </button>

            {cvOpen && (
              <div className="mt-1 pl-8 space-y-1">
                {customerValueChildren.map((item) => (
                  <SidebarMenuButton
                    key={item.title}
                    asChild
                    className={cn(
                      "w-full justify-start rounded-lg px-3 py-2",
                      "hover:bg-slate-100 hover:text-slate-900 transition-colors",
                      location.pathname.startsWith(item.url) &&
                        "bg-cyan-100 text-slate-900"
                    )}
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon
                        className={cn(
                          "h-4 w-4 flex-shrink-0",
                          location.pathname.startsWith(item.url)
                            ? "text-slate-900"
                            : "text-slate-500"
                        )}
                      />
                      {!collapsed && (
                        <span className="truncate">{item.title}</span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                ))}
              </div>
            )}
          </SidebarMenuItem>

          {/* Items that come AFTER Customer Value */}
          {topAfterCV.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className={cn(
                  "w-full justify-start rounded-xl px-3 py-2 transition-colors",
                  "hover:bg-slate-100 hover:text-slate-900",
                  isActive(item.url) && "bg-cyan-100 text-slate-900"
                )}
              >
                <Link to={item.url} className="flex items-center gap-3">
                  <item.icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0",
                      isActive(item.url) ? "text-slate-900" : "text-slate-500"
                    )}
                  />
                  {!collapsed && <span className="truncate">{item.title}</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          {/* ← ADD THIS: Admin Panel - Only visible to admins */}
          {isAdmin && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className={cn(
                  "w-full justify-start rounded-xl px-3 py-2 transition-colors",
                  "hover:bg-slate-100 hover:text-slate-900",
                  isActive("/admin") && "bg-cyan-100 text-slate-900"
                )}
              >
                <Link to="/admin" className="flex items-center gap-3">
                  <Shield
                    className={cn(
                      "h-5 w-5 flex-shrink-0",
                      isActive("/admin") ? "text-slate-900" : "text-slate-500"
                    )}
                  />
                  {!collapsed && <span className="truncate">Admin Panel</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>

        {/* FOOTER – pinned to bottom */}
        <div className="mt-auto pt-6">
          <SidebarMenu className="space-y-1">
            {[
              { title: "Help & Support", url: "/help", icon: HelpCircle },
              { title: "User Settings", url: "/settings", icon: Settings },
            ].map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "w-full justify-start rounded-xl px-3 py-2 transition-colors",
                    "hover:bg-slate-100 hover:text-slate-900",
                    isActive(item.url) && "bg-cyan-100 text-slate-900"
                  )}
                >
                  <Link to={item.url} className="flex items-center gap-3">
                    <item.icon
                      className={cn(
                        "h-5 w-5 flex-shrink-0",
                        isActive(item.url) ? "text-slate-900" : "text-slate-500"
                      )}
                    />
                    {!collapsed && (
                      <span className="truncate">{item.title}</span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}

            <SidebarMenuItem>
              <SidebarMenuButton
                className={cn(
                  "w-full justify-start rounded-xl px-3 py-2 transition-colors",
                  "text-red-600 hover:text-red-700 hover:bg-red-50"
                )}
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="truncate">Logout</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
