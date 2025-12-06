// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   FolderOpen,
//   Users,
//   Library,
//   ArrowRight,
//   Database,
//   FileText,
//   Search,
//   Filter,
//   Plus,
//   Upload,
//   Download,
//   Eye,
//   Edit,
//   Trash2,
// } from "lucide-react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";

// const libraryModules = [
//   {
//     title: "Content Manager",
//     description:
//       "Manage data sources, upload documents, and maintain your knowledge base with automated content processing",
//     icon: FolderOpen,
//     link: "/library/content-manager",
//     stats: "156 Documents • 8 Sources Connected",
//     gradient: "from-blue-500 to-cyan-500",
//     iconBg: "bg-blue-100",
//     iconColor: "text-blue-600",
//     features: [
//       "Data Source Integration",
//       "Document Upload",
//       "Content Processing",
//       "Search & Discovery",
//     ],
//   },
//   {
//     title: "Competitors",
//     description:
//       "Track competitor information, analyze market positioning, and maintain competitive intelligence data",
//     icon: Users,
//     link: "/library/competitors",
//     stats: "12 Competitors Tracked • 340+ Data Points",
//     gradient: "from-purple-500 to-pink-500",
//     iconBg: "bg-purple-100",
//     iconColor: "text-purple-600",
//     features: [
//       "Competitor Profiles",
//       "Market Analysis",
//       "Product Comparison",
//       "Content Tracking",
//     ],
//   },
// ];

// const quickStats = [
//   {
//     label: "Total Documents",
//     value: "1,247",
//     icon: FileText,
//     color: "text-blue-600",
//   },
//   {
//     label: "Data Sources",
//     value: "8",
//     icon: Database,
//     color: "text-green-600",
//   },
//   {
//     label: "Competitors Tracked",
//     value: "12",
//     icon: Users,
//     color: "text-purple-600",
//   },
//   {
//     label: "Content Updates",
//     value: "23",
//     icon: Library,
//     color: "text-orange-600",
//   },
// ];

// const recentDocuments = [
//   {
//     name: "Q4 Product Roadmap.pdf",
//     type: "PDF",
//     size: "2.4 MB",
//     uploaded: "2 hours ago",
//     status: "processed",
//   },
//   {
//     name: "Customer Success Playbook.docx",
//     type: "Word",
//     size: "1.8 MB",
//     uploaded: "4 hours ago",
//     status: "processing",
//   },
//   {
//     name: "Competitive Analysis Report.xlsx",
//     type: "Excel",
//     size: "3.2 MB",
//     uploaded: "1 day ago",
//     status: "processed",
//   },
//   {
//     name: "Sales Training Materials.pptx",
//     type: "PowerPoint",
//     size: "15.7 MB",
//     uploaded: "2 days ago",
//     status: "processed",
//   },
//   {
//     name: "API Documentation.md",
//     type: "Markdown",
//     size: "456 KB",
//     uploaded: "3 days ago",
//     status: "processed",
//   },
// ];

// const contentCategories = [
//   {
//     name: "Product Documentation",
//     count: 234,
//     color: "bg-blue-100 text-blue-800",
//   },
//   { name: "Sales Materials", count: 189, color: "bg-green-100 text-green-800" },
//   {
//     name: "Training Resources",
//     count: 156,
//     color: "bg-purple-100 text-purple-800",
//   },
//   {
//     name: "Competitive Intelligence",
//     count: 98,
//     color: "bg-orange-100 text-orange-800",
//   },
//   { name: "Customer Cases", count: 87, color: "bg-pink-100 text-pink-800" },
// ];

// export function LibraryHub() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("all");

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "processed":
//         return "bg-green-100 text-green-800";
//       case "processing":
//         return "bg-yellow-100 text-yellow-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div className="flex flex-col space-y-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
//               <Library className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
//                 Knowledge Library
//               </h1>
//               <p className="text-gray-600">
//                 Centralized hub for content management and competitive
//                 intelligence
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
//               <Upload className="w-4 h-4 mr-2" />
//               Upload Document
//             </Button>
//             <Button variant="outline">
//               <Plus className="w-4 h-4 mr-2" />
//               Add Source
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Quick Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         {quickStats.map((stat, index) => (
//           <Card
//             key={index}
//             className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
//           >
//             <CardContent className="p-6">
//               <div className="flex items-center space-x-4">
//                 <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
//                   <stat.icon className={`w-6 h-6 ${stat.color}`} />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold text-gray-900">
//                     {stat.value}
//                   </p>
//                   <p className="text-sm text-gray-600">{stat.label}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Search and Filter */}
//       <div className="flex flex-col md:flex-row gap-4">
//         <div className="flex-1">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <Input
//               placeholder="Search documents, sources, or content..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10"
//             />
//           </div>
//         </div>
//         <div className="flex items-center space-x-2">
//           <Filter className="w-4 h-4 text-gray-400" />
//           <select
//             value={selectedCategory}
//             onChange={(e) => setSelectedCategory(e.target.value)}
//             className="border border-gray-300 rounded-md px-3 py-2 text-sm"
//           >
//             <option value="all">All Categories</option>
//             <option value="documents">Documents</option>
//             <option value="sources">Data Sources</option>
//             <option value="competitors">Competitors</option>
//           </select>
//         </div>
//       </div>

//       {/* Content Categories */}
//       <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
//         <CardHeader>
//           <CardTitle>Content Categories</CardTitle>
//           <CardDescription>
//             Organize and discover content by category
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//             {contentCategories.map((category, index) => (
//               <div
//                 key={index}
//                 className="p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
//               >
//                 <div className="flex items-center justify-between mb-2">
//                   <Badge className={category.color} variant="secondary">
//                     {category.count}
//                   </Badge>
//                 </div>
//                 <p className="font-medium text-gray-900 text-sm">
//                   {category.name}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Library Modules */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {libraryModules.map((module) => (
//           <Card
//             key={module.title}
//             className="group border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
//           >
//             <div className={`h-2 bg-gradient-to-r ${module.gradient}`} />
//             <CardHeader className="pb-4">
//               <div className="flex items-start justify-between">
//                 <div className="flex items-center space-x-4">
//                   <div
//                     className={`w-16 h-16 ${module.iconBg} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
//                   >
//                     <module.icon className={`w-8 h-8 ${module.iconColor}`} />
//                   </div>
//                   <div>
//                     <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
//                       {module.title}
//                     </CardTitle>
//                     <p className="text-sm text-gray-500 font-medium mt-1">
//                       {module.stats}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </CardHeader>

//             <CardContent className="space-y-6">
//               <CardDescription className="text-gray-700 text-base leading-relaxed">
//                 {module.description}
//               </CardDescription>

//               {/* Features List */}
//               <div className="space-y-2">
//                 <h4 className="font-semibold text-gray-900 text-sm">
//                   Key Features:
//                 </h4>
//                 <div className="grid grid-cols-2 gap-2">
//                   {module.features.map((feature, index) => (
//                     <div key={index} className="flex items-center space-x-2">
//                       <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
//                       <span className="text-sm text-gray-600">{feature}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Action Button */}
//               <Link to={module.link} className="block">
//                 <Button
//                   className={`w-full bg-gradient-to-r ${module.gradient} hover:shadow-lg transition-all duration-300 text-white font-medium group-hover:scale-105`}
//                   size="lg"
//                 >
//                   Access {module.title}
//                   <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
//                 </Button>
//               </Link>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Recent Documents */}
//       <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle className="flex items-center space-x-2">
//                 <FileText className="w-5 h-5 text-blue-600" />
//                 <span>Recent Documents</span>
//               </CardTitle>
//               <CardDescription>
//                 Latest uploaded and processed documents
//               </CardDescription>
//             </div>
//             <Button variant="outline" size="sm">
//               <Eye className="w-4 h-4 mr-2" />
//               View All
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {recentDocuments.map((doc, index) => (
//               <div
//                 key={index}
//                 className="flex items-center justify-between p-4 rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
//               >
//                 <div className="flex items-center space-x-4">
//                   <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                     <FileText className="w-5 h-5 text-blue-600" />
//                   </div>
//                   <div>
//                     <p className="font-medium text-gray-900">{doc.name}</p>
//                     <p className="text-sm text-gray-600">
//                       {doc.type} • {doc.size} • {doc.uploaded}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-3">
//                   <Badge
//                     className={getStatusColor(doc.status)}
//                     variant="secondary"
//                   >
//                     {doc.status}
//                   </Badge>
//                   <div className="flex items-center space-x-1">
//                     <Button variant="ghost" size="sm">
//                       <Eye className="w-4 h-4" />
//                     </Button>
//                     <Button variant="ghost" size="sm">
//                       <Edit className="w-4 h-4" />
//                     </Button>
//                     <Button variant="ghost" size="sm">
//                       <Download className="w-4 h-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Recent Activity */}
//       <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
//         <CardHeader>
//           <CardTitle className="flex items-center space-x-2">
//             <Library className="w-5 h-5 text-blue-600" />
//             <span>Recent Library Activity</span>
//           </CardTitle>
//           <CardDescription>
//             Latest updates and changes across your knowledge base
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {[
//               {
//                 action: "Document uploaded",
//                 item: "Q4 Product Roadmap.pdf",
//                 time: "2 hours ago",
//                 type: "upload",
//               },
//               {
//                 action: "Competitor added",
//                 item: "TechCorp Solutions",
//                 time: "4 hours ago",
//                 type: "competitor",
//               },
//               {
//                 action: "Data source synced",
//                 item: "Confluence Integration",
//                 time: "1 day ago",
//                 type: "sync",
//               },
//               {
//                 action: "Content processed",
//                 item: "15 new documents indexed",
//                 time: "2 days ago",
//                 type: "process",
//               },
//             ].map((activity, index) => (
//               <div
//                 key={index}
//                 className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
//               >
//                 <div
//                   className={`w-10 h-10 rounded-full flex items-center justify-center ${
//                     activity.type === "upload"
//                       ? "bg-blue-100 text-blue-600"
//                       : activity.type === "competitor"
//                       ? "bg-purple-100 text-purple-600"
//                       : activity.type === "sync"
//                       ? "bg-green-100 text-green-600"
//                       : "bg-orange-100 text-orange-600"
//                   }`}
//                 >
//                   {activity.type === "upload" ? (
//                     <FileText className="w-5 h-5" />
//                   ) : activity.type === "competitor" ? (
//                     <Users className="w-5 h-5" />
//                   ) : activity.type === "sync" ? (
//                     <Database className="w-5 h-5" />
//                   ) : (
//                     <Library className="w-5 h-5" />
//                   )}
//                 </div>
//                 <div className="flex-1">
//                   <p className="font-medium text-gray-900">{activity.action}</p>
//                   <p className="text-sm text-gray-600">{activity.item}</p>
//                 </div>
//                 <span className="text-xs text-gray-500">{activity.time}</span>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

//================================ORIGINAL CODE================================//

//===============================1st EDIT========================
import React from "react";
import { Link } from "react-router-dom";
import { FolderOpen, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";

/** ---------------- Library Hub: uses the SAME shell as Dashboard ---------------- */
export function LibraryHub() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        {/* Left nav */}
        <AppSidebar />

        {/* Center + Right rail */}
        <div className="flex-1 flex flex-col">
          {/* Top bar (same as Dashboard) */}
          <header className="h-14 border-b bg-white flex items-center px-4">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-lg font-semibold">Library Hub</h1>
            </div>
          </header>

          {/* Middle area: center content + right rail */}
          <div className="flex-1 flex">
            {/* CENTER CONTENT */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1120px] px-6 py-6 font-['Poppins']">
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-3">
                    {/* <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-sm">
                      <FolderOpen className="h-5 w-5" />
                    </div> */}
                    {/* <div>
                      <h2 className="text-2xl font-semibold tracking-tight">
                        Library Hub
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Access and manage your content sources and competitor
                        information.
                      </p>
                    </div> */}
                  </div>
                </div>

                {/* Two cards (unchanged functionality) */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Content Manager */}
                  <Card className="rounded-xl border bg-white shadow-sm">
                    {" "}
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                          <FolderOpen className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">
                            Content Manager
                          </CardTitle>
                          <div className="mt-1 text-sm text-muted-foreground">
                            156 Documents • 8 Sources Connected
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-0">
                      <p className="text-sm text-slate-700">
                        Manage data sources for processing, search, and
                        analysis.
                      </p>
                      <Link to="/library/content-manager">
                        <br />
                        <Button className="w-full bg-slate-900 hover:bg-slate-800">
                          Manage Content Sources
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  {/* Competitors */}
                  <Card className="rounded-xl border bg-white shadow-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <div className="grid h-12 w-12 place-items-center rounded-xl bg-purple-50 text-purple-600 ring-1 ring-purple-100">
                          <Users className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">Competitors</CardTitle>
                          <div className="mt-1 text-sm text-muted-foreground">
                            12 Competitors Tracked • 340+ Data Points
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-0">
                      <p className="text-sm text-slate-700">
                        View and manage competitor information and analysis.
                      </p>
                      <Link to="/library/competitors">
                        <br />
                        <Button className="w-full bg-slate-900 hover:bg-slate-800">
                          View Competitors
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </section>
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

export default LibraryHub;
