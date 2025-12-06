// src/components/settings/SettingsDashboard.tsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, Download, Loader2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AIChatbot } from "@/components/shared/AIChatbot";
import {
  User,
  Settings,
  Bell,
  Shield,
  Database,
  Palette,
  Globe,
  Key,
  Mail,
  Phone,
  Camera,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";

/* ---- App shell (same pattern as ReportsDashboard/HelpCenter) ---- */
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";

export function SettingsDashboard() {
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false,
  });
  const [isSaving, setIsSaving] = useState(false);

  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567",
    role: "Customer Success Manager",
    department: "Customer Success",
    timezone: "America/New_York",
    language: "English",
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        {/* Left nav */}
        <AppSidebar />

        {/* Center + Right rail */}
        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <header className="h-14 border-b bg-white flex items-center px-4">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-lg font-semibold">Settings</h1>
            </div>
          </header>

          {/* Middle area: center content + right rail */}
          <div className="flex-1 flex">
            {/* CENTER CONTENT */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1120px] px-6 py-6 font-['Poppins']">
                {/* ===== Your original Settings UI (unchanged) ===== */}
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      Settings & Preferences
                    </h1>
                    <p className="text-gray-600">
                      Manage your account, notifications, and system preferences
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                    <Button
                      onClick={async () => {
                        setIsSaving(true);
                        try {
                          // TODO: call your save endpoint here
                          // await api.saveSettings(payload)
                        } finally {
                          setIsSaving(false);
                        }
                      }}
                      disabled={isSaving}
                      className="
    h-10 px-4 rounded-xl
    bg-blue-600 text-white
    shadow-sm hover:shadow-md
    hover:bg-blue-700
    transition-all
    focus-visible:outline-none
    focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500
    disabled:opacity-70 disabled:cursor-not-allowed
  "
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving…
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
                  {/* Main Settings Content */}
                  <div className="lg:col-span-3">
                    <Tabs defaultValue="profile" className="space-y-6">
                      <TabsList className="grid w-full grid-cols-6">
                        <TabsTrigger
                          value="profile"
                          className="flex items-center space-x-2"
                        >
                          <User className="w-4 h-4" />
                          <span className="hidden sm:inline">Profile</span>
                        </TabsTrigger>
                        <TabsTrigger
                          value="notifications"
                          className="flex items-center space-x-2"
                        >
                          <Bell className="w-4 h-4" />
                          <span className="hidden sm:inline">
                            Notifications
                          </span>
                        </TabsTrigger>
                        <TabsTrigger
                          value="security"
                          className="flex items-center space-x-2"
                        >
                          <Shield className="w-4 h-4" />
                          <span className="hidden sm:inline">Security</span>
                        </TabsTrigger>
                        <TabsTrigger
                          value="integrations"
                          className="flex items-center space-x-2"
                        >
                          <Database className="w-4 h-4" />
                          <span className="hidden sm:inline">Integrations</span>
                        </TabsTrigger>
                        <TabsTrigger
                          value="appearance"
                          className="flex items-center space-x-2"
                        >
                          <Palette className="w-4 h-4" />
                          <span className="hidden sm:inline">Appearance</span>
                        </TabsTrigger>
                        <TabsTrigger
                          value="preferences"
                          className="flex items-center space-x-2"
                        >
                          <Settings className="w-4 h-4" />
                          <span className="hidden sm:inline">Preferences</span>
                        </TabsTrigger>
                      </TabsList>

                      {/* Profile Settings */}
                      <TabsContent value="profile">
                        <Card className="card-3d">
                          <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                              <User className="w-5 h-5" />
                              <span>Profile Information</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            {/* Avatar Section */}
                            <div className="flex items-center space-x-4">
                              <Avatar className="w-20 h-20">
                                <AvatarImage src="/placeholder-avatar.jpg" />
                                <AvatarFallback className="text-lg bg-blue-100 text-blue-600">
                                  JD
                                </AvatarFallback>
                              </Avatar>
                              <div className="space-y-2">
                                <Button variant="outline" size="sm">
                                  <Camera className="w-4 h-4 mr-2" />
                                  Change Photo
                                </Button>
                                <p className="text-sm text-gray-600">
                                  JPG, GIF or PNG. 1MB max.
                                </p>
                              </div>
                            </div>

                            {/* Form Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                  id="firstName"
                                  value={profile.firstName}
                                  onChange={(e) =>
                                    setProfile({
                                      ...profile,
                                      firstName: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                  id="lastName"
                                  value={profile.lastName}
                                  onChange={(e) =>
                                    setProfile({
                                      ...profile,
                                      lastName: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  value={profile.email}
                                  onChange={(e) =>
                                    setProfile({
                                      ...profile,
                                      email: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                  id="phone"
                                  value={profile.phone}
                                  onChange={(e) =>
                                    setProfile({
                                      ...profile,
                                      phone: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="role">Job Title</Label>
                                <Input
                                  id="role"
                                  value={profile.role}
                                  onChange={(e) =>
                                    setProfile({
                                      ...profile,
                                      role: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="department">Department</Label>
                                <Select
                                  value={profile.department}
                                  onValueChange={(value) =>
                                    setProfile({
                                      ...profile,
                                      department: value,
                                    })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Customer Success">
                                      Customer Success
                                    </SelectItem>
                                    <SelectItem value="Sales">Sales</SelectItem>
                                    <SelectItem value="Marketing">
                                      Marketing
                                    </SelectItem>
                                    <SelectItem value="Engineering">
                                      Engineering
                                    </SelectItem>
                                    <SelectItem value="Operations">
                                      Operations
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="bio">Bio</Label>
                              <Textarea
                                id="bio"
                                placeholder="Tell us about yourself..."
                                rows={4}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      {/* Notifications Settings */}
                      <TabsContent value="notifications">
                        <Card className="card-3d">
                          <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                              <Bell className="w-5 h-5" />
                              <span>Notification Preferences</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium">
                                    Email Notifications
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    Receive updates via email
                                  </p>
                                </div>
                                <Switch
                                  checked={notifications.email}
                                  onCheckedChange={(checked) =>
                                    setNotifications({
                                      ...notifications,
                                      email: checked,
                                    })
                                  }
                                />
                              </div>

                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium">
                                    Push Notifications
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    Browser push notifications
                                  </p>
                                </div>
                                <Switch
                                  checked={notifications.push}
                                  onCheckedChange={(checked) =>
                                    setNotifications({
                                      ...notifications,
                                      push: checked,
                                    })
                                  }
                                />
                              </div>

                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium">
                                    SMS Notifications
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    Important alerts via text message
                                  </p>
                                </div>
                                <Switch
                                  checked={notifications.sms}
                                  onCheckedChange={(checked) =>
                                    setNotifications({
                                      ...notifications,
                                      sms: checked,
                                    })
                                  }
                                />
                              </div>

                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium">
                                    Marketing Communications
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    Product updates and newsletters
                                  </p>
                                </div>
                                <Switch
                                  checked={notifications.marketing}
                                  onCheckedChange={(checked) =>
                                    setNotifications({
                                      ...notifications,
                                      marketing: checked,
                                    })
                                  }
                                />
                              </div>
                            </div>

                            <div className="border-t pt-4">
                              <h4 className="font-medium mb-4">
                                Notification Timing
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Quiet Hours Start</Label>
                                  <Select defaultValue="22:00">
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="20:00">
                                        8:00 PM
                                      </SelectItem>
                                      <SelectItem value="21:00">
                                        9:00 PM
                                      </SelectItem>
                                      <SelectItem value="22:00">
                                        10:00 PM
                                      </SelectItem>
                                      <SelectItem value="23:00">
                                        11:00 PM
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Quiet Hours End</Label>
                                  <Select defaultValue="08:00">
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="06:00">
                                        6:00 AM
                                      </SelectItem>
                                      <SelectItem value="07:00">
                                        7:00 AM
                                      </SelectItem>
                                      <SelectItem value="08:00">
                                        8:00 AM
                                      </SelectItem>
                                      <SelectItem value="09:00">
                                        9:00 AM
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      {/* Security Settings */}
                      <TabsContent value="security">
                        <div className="space-y-6">
                          <Card className="card-3d">
                            <CardHeader>
                              <CardTitle className="flex items-center space-x-2">
                                <Shield className="w-5 h-5" />
                                <span>Security Settings</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="currentPassword">
                                    Current Password
                                  </Label>
                                  <div className="relative">
                                    <Input
                                      id="currentPassword"
                                      type={showPassword ? "text" : "password"}
                                      placeholder="Enter current password"
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                      onClick={() =>
                                        setShowPassword(!showPassword)
                                      }
                                    >
                                      {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                      ) : (
                                        <Eye className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="newPassword">
                                    New Password
                                  </Label>
                                  <Input
                                    id="newPassword"
                                    type="password"
                                    placeholder="Enter new password"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="confirmPassword">
                                    Confirm New Password
                                  </Label>
                                  <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm new password"
                                  />
                                </div>
                              </div>

                              <Button className="w-full md:w-auto">
                                Update Password
                              </Button>
                            </CardContent>
                          </Card>

                          <Card className="card-3d">
                            <CardHeader>
                              <CardTitle>Two-Factor Authentication</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium">Enable 2FA</h4>
                                  <p className="text-sm text-gray-600">
                                    Add an extra layer of security to your
                                    account
                                  </p>
                                </div>
                                <Switch />
                              </div>
                              <Button variant="outline">
                                Setup Authenticator App
                              </Button>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>

                      {/* Integrations Settings */}
                      <TabsContent value="integrations">
                        <Card className="card-3d">
                          <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                              <Database className="w-5 h-5" />
                              <span>Connected Integrations</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Database className="w-5 h-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium">
                                      Salesforce CRM
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      Connected - Syncing customer data
                                    </p>
                                  </div>
                                </div>
                                <Button variant="outline" size="sm">
                                  Configure
                                </Button>
                              </div>

                              <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-green-600" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium">
                                      HubSpot Marketing
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      Connected - Email campaigns active
                                    </p>
                                  </div>
                                </div>
                                <Button variant="outline" size="sm">
                                  Configure
                                </Button>
                              </div>

                              <div className="flex items-center justify-between p-4 border rounded-lg opacity-50">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <Key className="w-5 h-5 text-gray-600" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium">
                                      Slack Workspace
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      Not connected
                                    </p>
                                  </div>
                                </div>
                                <Button size="sm">Connect</Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      {/* Appearance Settings */}
                      <TabsContent value="appearance">
                        <Card className="card-3d">
                          <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                              <Palette className="w-5 h-5" />
                              <span>Appearance Preferences</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Theme</Label>
                                <Select defaultValue="light">
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="light">Light</SelectItem>
                                    <SelectItem value="dark">Dark</SelectItem>
                                    <SelectItem value="system">
                                      System
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label>Color Scheme</Label>
                                <div className="flex space-x-2">
                                  <div className="w-8 h-8 bg-blue-500 rounded-lg cursor-pointer border-2 border-blue-600"></div>
                                  <div className="w-8 h-8 bg-purple-500 rounded-lg cursor-pointer"></div>
                                  <div className="w-8 h-8 bg-green-500 rounded-lg cursor-pointer"></div>
                                  <div className="w-8 h-8 bg-orange-500 rounded-lg cursor-pointer"></div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label>Font Size</Label>
                                <Select defaultValue="medium">
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="small">Small</SelectItem>
                                    <SelectItem value="medium">
                                      Medium
                                    </SelectItem>
                                    <SelectItem value="large">Large</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      {/* Preferences Settings */}
                      <TabsContent value="preferences">
                        <Card className="card-3d">
                          <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                              <Globe className="w-5 h-5" />
                              <span>System Preferences</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label>Timezone</Label>
                                <Select
                                  value={profile.timezone}
                                  onValueChange={(value) =>
                                    setProfile({ ...profile, timezone: value })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="America/New_York">
                                      Eastern Time
                                    </SelectItem>
                                    <SelectItem value="America/Chicago">
                                      Central Time
                                    </SelectItem>
                                    <SelectItem value="America/Denver">
                                      Mountain Time
                                    </SelectItem>
                                    <SelectItem value="America/Los_Angeles">
                                      Pacific Time
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label>Language</Label>
                                <Select
                                  value={profile.language}
                                  onValueChange={(value) =>
                                    setProfile({ ...profile, language: value })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="English">
                                      English
                                    </SelectItem>
                                    <SelectItem value="Spanish">
                                      Spanish
                                    </SelectItem>
                                    <SelectItem value="French">
                                      French
                                    </SelectItem>
                                    <SelectItem value="German">
                                      German
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label>Date Format</Label>
                                <Select defaultValue="mm/dd/yyyy">
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="mm/dd/yyyy">
                                      MM/DD/YYYY
                                    </SelectItem>
                                    <SelectItem value="dd/mm/yyyy">
                                      DD/MM/YYYY
                                    </SelectItem>
                                    <SelectItem value="yyyy-mm-dd">
                                      YYYY-MM-DD
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label>Number Format</Label>
                                <Select defaultValue="us">
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="us">
                                      US (1,234.56)
                                    </SelectItem>
                                    <SelectItem value="eu">
                                      European (1.234,56)
                                    </SelectItem>
                                    <SelectItem value="uk">
                                      UK (1,234.56)
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="border-t pt-6">
                              <h4 className="font-medium mb-4 text-red-600">
                                Danger Zone
                              </h4>
                              <div className="space-y-4">
                                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                                  <h5 className="font-medium text-red-900">
                                    Delete Account
                                  </h5>
                                  <p className="text-sm text-red-700 mb-3">
                                    Once you delete your account, there is no
                                    going back. Please be certain.
                                  </p>
                                  <Button variant="destructive" size="sm">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Account
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Account Summary */}
                    <Card className="card-3d">
                      <CardHeader>
                        <CardTitle className="text-sm">
                          Account Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Member Since</span>
                          <span className="font-medium">Jan 2024</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Login</span>
                          <span className="font-medium">Today</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Plan</span>
                          <span className="font-medium">Professional</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Storage Used</span>
                          <span className="font-medium">2.4 GB / 10 GB</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="card-3d">
                      <CardHeader>
                        <CardTitle className="text-sm">Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export Data
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                        >
                          <Key className="w-4 h-4 mr-2" />
                          API Keys
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Activity Log
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                {/* ===== end original UI ===== */}
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

export default SettingsDashboard;
