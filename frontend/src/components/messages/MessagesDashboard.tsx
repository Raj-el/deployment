// src/components/messages/MessagesDashboard.tsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageSquare,
  Search,
  Send,
  Phone,
  Video,
  MoreHorizontal,
  Paperclip,
  Smile,
  Filter,
  Users,
  Clock,
  CheckCircle2,
  Archive,
  Star,
} from "lucide-react";

/* ---- App shell (same as LibraryHub/Dashboard) ---- */
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";

const messageStats = [
  {
    title: "Unread Messages",
    value: "23",
    change: "+5",
    icon: MessageSquare,
    color: "text-blue-600",
  },
  {
    title: "Active Conversations",
    value: "12",
    change: "+2",
    icon: Users,
    color: "text-green-600",
  },
  {
    title: "Avg Response Time",
    value: "2.4h",
    change: "-0.8h",
    icon: Clock,
    color: "text-purple-600",
  },
  {
    title: "Satisfaction Score",
    value: "4.8",
    change: "+0.2",
    icon: Star,
    color: "text-yellow-600",
  },
];

const mockConversations = [
  {
    id: "1",
    customer: "John Smith",
    company: "Acme Corporation",
    avatar: "JS",
    lastMessage:
      "Thanks for the quick response! The integration is working perfectly now.",
    timestamp: "2024-01-25T14:30:00",
    unreadCount: 0,
    priority: "Low",
    status: "Resolved",
    channel: "Email",
  },
  {
    id: "2",
    customer: "Sarah Johnson",
    company: "TechStart Solutions",
    avatar: "SJ",
    lastMessage:
      "We're experiencing some issues with the dashboard loading. Can you help?",
    timestamp: "2024-01-25T13:45:00",
    unreadCount: 2,
    priority: "High",
    status: "Open",
    channel: "Chat",
  },
  {
    id: "3",
    customer: "Mike Chen",
    company: "Global Industries",
    avatar: "MC",
    lastMessage:
      "The training session was excellent. Our team is much more confident now.",
    timestamp: "2024-01-25T11:20:00",
    unreadCount: 0,
    priority: "Low",
    status: "Closed",
    channel: "Phone",
  },
  {
    id: "4",
    customer: "Emma Wilson",
    company: "Innovation Labs",
    avatar: "EW",
    lastMessage: "When can we schedule the next quarterly business review?",
    timestamp: "2024-01-25T09:15:00",
    unreadCount: 1,
    priority: "Medium",
    status: "Open",
    channel: "Email",
  },
];

const mockMessages = [
  {
    id: "1",
    sender: "customer",
    content:
      "Hi there! We're experiencing some issues with the dashboard loading. Can you help?",
    timestamp: "2024-01-25T13:45:00",
    type: "text",
  },
  {
    id: "2",
    sender: "agent",
    content:
      "Hello Sarah! I'd be happy to help you with the dashboard issue. Can you tell me what specific error message you're seeing?",
    timestamp: "2024-01-25T13:47:00",
    type: "text",
  },
  {
    id: "3",
    sender: "customer",
    content:
      "It just shows a loading spinner and never loads the data. This started happening this morning.",
    timestamp: "2024-01-25T13:48:00",
    type: "text",
  },
  {
    id: "4",
    sender: "agent",
    content:
      "I see the issue. There was a brief service disruption this morning. Let me check if it's affecting your specific account.",
    timestamp: "2024-01-25T13:50:00",
    type: "text",
  },
];

export function MessagesDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(
    mockConversations[1]
  );
  const [newMessage, setNewMessage] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");

  const filteredConversations = mockConversations.filter((conv) => {
    const matchesSearch =
      conv.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority =
      filterPriority === "all" ||
      conv.priority.toLowerCase() === filterPriority.toLowerCase();
    return matchesSearch && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-700 bg-red-50 ring-1 ring-red-100";
      case "Medium":
        return "text-amber-700 bg-amber-50 ring-1 ring-amber-100";
      case "Low":
        return "text-green-700 bg-green-50 ring-1 ring-green-100";
      default:
        return "text-gray-700 bg-gray-50 ring-1 ring-gray-100";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Open":
        return "destructive";
      case "Resolved":
        return "default";
      case "Closed":
        return "secondary";
      default:
        return "outline";
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        {/* Left nav */}
        <AppSidebar />

        {/* Center + Right rail */}
        <div className="flex-1 flex flex-col">
          {/* Top bar (same shell as LibraryHub/Dashboard) */}
          <header className="h-14 border-b bg-white flex items-center px-4">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-lg font-semibold">Messages</h1>
            </div>
          </header>

          {/* Middle area: center content + right rail */}
          <div className="flex-1 flex">
            {/* CENTER CONTENT */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1120px] px-6 py-6 font-['Poppins']">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      Messages & Communications
                    </h1>
                    <p className="text-gray-600">
                      Manage customer communications across all channels
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" className="h-9">
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                    <Button variant="outline" className="h-9">
                      <Archive className="w-4 h-4 mr-2" />
                      Archive
                    </Button>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
                  {messageStats.map((stat) => (
                    <Card
                      key={stat.title}
                      className="hover:shadow-md transition-all duration-200 border border-gray-200"
                    >
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                          {stat.title}
                        </CardTitle>
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-semibold mb-1">
                          {stat.value}
                        </div>
                        <p className="text-xs text-green-600">
                          {stat.change} from yesterday
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Main 3-column zone */}
                <div className="mt-6 grid grid-cols-[320px_minmax(0,1fr)] gap-6 min-h-[640px]">
                  {/* Conversations List */}
                  <Card className="border border-gray-200 overflow-hidden">
                    {/* Sticky header for list */}
                    <CardHeader className="pb-3 sticky top-0 bg-white z-10 border-b">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                          <MessageSquare className="w-5 h-5" />
                          <span>Conversations</span>
                        </CardTitle>
                        <Badge variant="destructive" className="text-xs">
                          {
                            mockConversations.filter((c) => c.unreadCount > 0)
                              .length
                          }{" "}
                          new
                        </Badge>
                      </div>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search conversations..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-9 h-9"
                        />
                      </div>
                    </CardHeader>

                    <CardContent className="p-0">
                      <ScrollArea className="h-[calc(640px-116px)]">
                        <ul className="divide-y">
                          {filteredConversations.map((conversation) => {
                            const active =
                              selectedConversation?.id === conversation.id;
                            return (
                              <li
                                key={conversation.id}
                                className={`px-3 py-3 cursor-pointer transition-colors ${
                                  active
                                    ? "bg-blue-50"
                                    : "hover:bg-gray-50/60 bg-white"
                                }`}
                                onClick={() =>
                                  setSelectedConversation(conversation)
                                }
                              >
                                <div className="flex items-start gap-3">
                                  <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm shrink-0 ${
                                      active
                                        ? "bg-blue-200 text-blue-900"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    {conversation.avatar}
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                      <h4 className="font-medium text-[13px] truncate pr-2">
                                        {conversation.customer}
                                      </h4>
                                      <div className="flex items-center gap-1 shrink-0">
                                        {conversation.unreadCount > 0 && (
                                          <Badge className="text-[10px] px-1.5 py-0.5 bg-blue-600 hover:bg-blue-600">
                                            {conversation.unreadCount}
                                          </Badge>
                                        )}
                                        <span className="text-[11px] text-gray-500">
                                          {new Date(
                                            conversation.timestamp
                                          ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                        </span>
                                      </div>
                                    </div>

                                    <p className="text-[11px] text-gray-600 truncate">
                                      {conversation.company}
                                    </p>

                                    <p className="text-[12px] text-gray-700 line-clamp-2 mt-1">
                                      {conversation.lastMessage}
                                    </p>

                                    <div className="mt-2 flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <span
                                          className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getPriorityColor(
                                            conversation.priority
                                          )}`}
                                        >
                                          {conversation.priority}
                                        </span>
                                        <Badge
                                          variant={getStatusBadgeVariant(
                                            conversation.status
                                          )}
                                          className="text-[10px]"
                                        >
                                          {conversation.status}
                                        </Badge>
                                      </div>
                                      <span className="text-[11px] text-gray-500">
                                        {conversation.channel}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  {/* Chat Window */}
                  <Card className="border border-gray-200 flex flex-col overflow-hidden">
                    {selectedConversation ? (
                      <>
                        {/* Sticky chat header */}
                        <div className="px-4 py-3 border-b bg-white sticky top-0 z-10">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-medium text-blue-600">
                                {selectedConversation.avatar}
                              </div>
                              <div className="leading-tight">
                                <h3 className="font-semibold text-[15px]">
                                  {selectedConversation.customer}
                                </h3>
                                <p className="text-[12px] text-gray-600">
                                  {selectedConversation.company}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Phone className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Video className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1">
                          <ScrollArea className="h-[calc(640px-56px-84px)] px-4 py-4">
                            <div className="space-y-3">
                              {mockMessages.map((message) => {
                                const mine = message.sender === "agent";
                                return (
                                  <div
                                    key={message.id}
                                    className={`flex ${
                                      mine ? "justify-end" : "justify-start"
                                    }`}
                                  >
                                    <div
                                      className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${
                                        mine
                                          ? "bg-blue-600 text-white rounded-tr-md"
                                          : "bg-gray-100 text-gray-900 rounded-tl-md"
                                      }`}
                                    >
                                      <p className="text-[13px] leading-relaxed">
                                        {message.content}
                                      </p>
                                      <p
                                        className={`text-[10px] mt-1 ${
                                          mine
                                            ? "text-blue-100"
                                            : "text-gray-500"
                                        }`}
                                      >
                                        {new Date(
                                          message.timestamp
                                        ).toLocaleTimeString([], {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </ScrollArea>
                        </div>

                        {/* Sticky composer */}
                        <div className="px-4 py-3 border-t bg-white sticky bottom-0">
                          <div className="flex items-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9"
                            >
                              <Paperclip className="w-4 h-4" />
                            </Button>
                            <Textarea
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              placeholder="Type your message..."
                              rows={2}
                              className="flex-1 resize-none text-[14px]"
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  handleSendMessage();
                                }
                              }}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9"
                            >
                              <Smile className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={handleSendMessage}
                              disabled={!newMessage.trim()}
                              size="sm"
                              className="px-3 h-9"
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <p>Select a conversation to start messaging</p>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            </main>

            {/* RIGHT RAIL (same component used on Dashboard) */}
            <DataSourcePanel />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default MessagesDashboard;
