// import React, { useState } from "react";
// import {
//   Database,
//   Mail,
//   MessageSquare,
//   FileText,
//   Calendar,
//   Settings,
//   CheckCircle,
//   AlertCircle,
//   Clock,
// } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { AddDataSource } from "@/components/data-sources/AddDataSource";
// import { ManageSources } from "@/components/data-sources/ManageSources";

// const dataSources = [
//   {
//     name: "Salesforce CRM",
//     icon: Database,
//     status: "connected",
//     lastSync: "2 min ago",
//     type: "CRM",
//   },
//   {
//     name: "Microsoft Outlook",
//     icon: Mail,
//     status: "connected",
//     lastSync: "5 min ago",
//     type: "Email",
//   },
//   {
//     name: "Slack",
//     icon: MessageSquare,
//     status: "syncing",
//     lastSync: "Syncing...",
//     type: "Communication",
//   },
//   {
//     name: "Confluence",
//     icon: FileText,
//     status: "error",
//     lastSync: "2 hours ago",
//     type: "Documentation",
//   },
//   {
//     name: "Google Calendar",
//     icon: Calendar,
//     status: "connected",
//     lastSync: "1 min ago",
//     type: "Calendar",
//   },
// ];

// const contentTypes = [
//   "All",
//   "CRM",
//   "Email",
//   "Communication",
//   "Documentation",
//   "Calendar",
// ];

// type ViewMode = "panel" | "add-source" | "manage-sources";

// export function DataSourcePanel() {
//   const [selectedTypes, setSelectedTypes] = useState(["All"]);
//   const [viewMode, setViewMode] = useState<ViewMode>("panel");

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "connected":
//         return <CheckCircle className="w-4 h-4 text-green-500" />;
//       case "syncing":
//         return <Clock className="w-4 h-4 text-yellow-500" />;
//       case "error":
//         return <AlertCircle className="w-4 h-4 text-red-500" />;
//       default:
//         return <AlertCircle className="w-4 h-4 text-gray-400" />;
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "connected":
//         return "text-green-600";
//       case "syncing":
//         return "text-yellow-600";
//       case "error":
//         return "text-red-600";
//       default:
//         return "text-gray-600";
//     }
//   };

//   const toggleContentType = (type: string) => {
//     if (type === "All") {
//       setSelectedTypes(["All"]);
//     } else {
//       const newTypes = selectedTypes.filter((t) => t !== "All");
//       if (newTypes.includes(type)) {
//         const filtered = newTypes.filter((t) => t !== type);
//         setSelectedTypes(filtered.length === 0 ? ["All"] : filtered);
//       } else {
//         setSelectedTypes([...newTypes, type]);
//       }
//     }
//   };

//   const filteredSources = selectedTypes.includes("All")
//     ? dataSources
//     : dataSources.filter((source) => selectedTypes.includes(source.type));

//   if (viewMode === "add-source") {
//     return <AddDataSource onBack={() => setViewMode("panel")} />;
//   }

//   if (viewMode === "manage-sources") {
//     return <ManageSources onBack={() => setViewMode("panel")} />;
//   }

//   return (
//     <div className="w-80 bg-white border-l p-4 space-y-4">
//       <div className="flex items-center justify-between">
//         <h2 className="text-lg font-semibold">Data Sources</h2>
//         <Button variant="ghost" size="sm">
//           <Settings className="w-4 h-4" />
//         </Button>
//       </div>

//       {/* Content Type Filters */}
//       <Card>
//         <CardHeader className="pb-3">
//           <CardTitle className="text-sm">Content Types</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-2">
//           <div className="flex flex-wrap gap-2">
//             {contentTypes.map((type) => (
//               <Badge
//                 key={type}
//                 variant={selectedTypes.includes(type) ? "default" : "outline"}
//                 className="cursor-pointer text-xs"
//                 onClick={() => toggleContentType(type)}
//               >
//                 {type}
//               </Badge>
//             ))}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Data Sources List */}
//       <Card>
//         <CardHeader className="pb-3">
//           <CardTitle className="text-sm">Connected Sources</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-3">
//           {filteredSources.map((source) => (
//             <div
//               key={source.name}
//               className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
//             >
//               <source.icon className="w-5 h-5 text-gray-600" />
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium truncate">{source.name}</p>
//                 <div className="flex items-center space-x-2">
//                   {getStatusIcon(source.status)}
//                   <p className={`text-xs ${getStatusColor(source.status)}`}>
//                     {source.lastSync}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </CardContent>
//       </Card>

//       {/* Quick Actions */}
//       <Card>
//         <CardHeader className="pb-3">
//           <CardTitle className="text-sm">Quick Actions</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-2">
//           <Button
//             variant="outline"
//             size="sm"
//             className="w-full justify-start"
//             onClick={() => setViewMode("add-source")}
//           >
//             <Database className="w-4 h-4 mr-2" />
//             Add Data Source
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             className="w-full justify-start"
//             onClick={() => setViewMode("manage-sources")}
//           >
//             <Settings className="w-4 h-4 mr-2" />
//             Manage Sources
//           </Button>
//         </CardContent>
//       </Card>

//       {/* Data Health */}
//       <Card>
//         <CardHeader className="pb-3">
//           <CardTitle className="text-sm">Data Health</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-2">
//             <div className="flex justify-between text-sm">
//               <span>Connected Sources</span>
//               <span className="font-medium">3/5</span>
//             </div>
//             <div className="flex justify-between text-sm">
//               <span>Last Full Sync</span>
//               <span className="font-medium">1 hour ago</span>
//             </div>
//             <div className="flex justify-between text-sm">
//               <span>Data Freshness</span>
//               <Badge variant="outline" className="text-xs">
//                 Good
//               </Badge>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

//================================ORIGNAL===========================

//==================================1st DRAFT========================
// import React from "react";
// import {
//   Database,
//   User,
//   Settings as Cog,
//   BarChart3,
//   MessageSquare,
//   Cloud,
//   Mail,
// } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// export function DataSourcePanel() {
//   const sources = [
//     { label: "Salesforce", icon: Database, key: "salesforce" },
//     { label: "HubSpot", icon: User, key: "hubspot" },
//     { label: "Zendesk", icon: Cog, key: "zendesk" },
//     { label: "Gainsight", icon: BarChart3, key: "gainsight" },
//     { label: "Totango", icon: BarChart3, key: "totango" },
//     { label: "Microsoft Teams", icon: MessageSquare, key: "msteams" },
//     { label: "Slack", icon: MessageSquare, key: "slack" },
//     { label: "SharePoint", icon: Cloud, key: "sharepoint" },
//     { label: "Google Drive", icon: Cloud, key: "gdrive" },
//     { label: "Gmail / Outlook", icon: Mail, key: "email" },
//   ];

//   const contentTypes = [
//     { label: "CRM Data", icon: Database, key: "crmdata" },
//     { label: "CS Platform Data", icon: BarChart3, key: "csplatform" },
//   ];

//   const RowButton = ({
//     Icon,
//     text,
//     onClick,
//   }: {
//     Icon: any;
//     text: string;
//     onClick: () => void;
//   }) => (
//     <Button
//       variant="ghost"
//       className="w-full justify-start rounded-xl px-3 py-2 h-auto hover:bg-slate-100"
//       onClick={onClick}
//       aria-label={text}
//     >
//       <Icon className="h-5 w-5 text-slate-500 mr-3" />
//       <span className="text-sm text-slate-700">{text}</span>
//     </Button>
//   );

//   // Placeholder click handler (leave markers to hook up later)
//   const handleClick = (key: string) => {
//     // TODO: route or connect action here (e.g., navigate(`/sources/${key}`))
//     // console.log("Clicked:", key);
//   };

//   return (
//     <aside className="w-80 border-l bg-white p-4 space-y-4">
//       {/* Content Tree */}
//       <Card className="rounded-2xl border">
//         <CardHeader className="pb-1">
//           <CardTitle className="text-lg">Content Tree</CardTitle>
//           <div className="text-sm text-slate-500">Data Sources</div>
//         </CardHeader>
//         <CardContent className="pt-2">
//           <div className="space-y-1">
//             {sources.map((s) => (
//               <RowButton
//                 key={s.key}
//                 Icon={s.icon}
//                 text={s.label}
//                 onClick={() => handleClick(s.key)}
//               />
//             ))}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Content Types */}
//       <Card className="rounded-2xl border">
//         <CardHeader className="pb-1">
//           <CardTitle className="text-lg">Content Types</CardTitle>
//         </CardHeader>
//         <CardContent className="pt-2">
//           <div className="space-y-1">
//             {contentTypes.map((t) => (
//               <RowButton
//                 key={t.key}
//                 Icon={t.icon}
//                 text={t.label}
//                 onClick={() => handleClick(t.key)}
//               />
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </aside>
//   );
// }

//==================================END 1st DRAFT========================

//========================2nd DRAFT========================
import React from "react";
import {
  Database,
  User,
  Settings as Cog,
  BarChart3,
  MessageSquare,
  Cloud,
  Mail,
  FileText,
  BookOpen,
  Users,
  Globe,
  Ticket,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function DataSourcePanel() {
  const sources = [
    { label: "Salesforce", icon: Database, key: "salesforce" },
    { label: "HubSpot", icon: User, key: "hubspot" },
    { label: "Zendesk", icon: Cog, key: "zendesk" },
    { label: "Gainsight", icon: BarChart3, key: "gainsight" },
    { label: "Totango", icon: BarChart3, key: "totango" },
    { label: "Microsoft Teams", icon: MessageSquare, key: "msteams" },
    { label: "Slack", icon: MessageSquare, key: "slack" },
    { label: "SharePoint", icon: Cloud, key: "sharepoint" },
    { label: "Google Drive", icon: Cloud, key: "gdrive" },
    { label: "Gmail / Outlook", icon: Mail, key: "email" },
  ];

  // Expanded Content Types (matches your second screenshot)
  const contentTypes = [
    { label: "CRM Data", icon: Database, key: "crmdata" },
    { label: "CS Platform Data", icon: BarChart3, key: "csplatform" },
    { label: "Communication Logs", icon: MessageSquare, key: "comm-logs" },
    { label: "Documents & Files", icon: FileText, key: "docs-files" },
    { label: "Support Tickets", icon: Ticket, key: "support-tickets" },
    { label: "Product Usage Data", icon: BarChart3, key: "product-usage" },
    { label: "Knowledge Base Articles", icon: BookOpen, key: "kb-articles" },
    { label: "Expert Knowledge", icon: Users, key: "expert-knowledge" },
    { label: "Scraped Web Content", icon: Globe, key: "scraped-web" },
  ];

  const RowButton = ({
    Icon,
    text,
    onClick,
  }: {
    Icon: any;
    text: string;
    onClick: () => void;
  }) => (
    <Button
      variant="ghost"
      className="w-full justify-start rounded-xl px-3 py-2 h-auto hover:bg-slate-100"
      onClick={onClick}
      aria-label={text}
    >
      <Icon className="h-5 w-5 text-slate-500 mr-3" />
      <span className="text-sm text-slate-700">{text}</span>
    </Button>
  );

  // Placeholder click handler (wire routing later)
  const handleClick = (key: string) => {
    // TODO: navigate(`/sources/${key}`) or open a drawer, etc.
  };

  return (
    <aside className="w-80 border-l bg-white p-4 space-y-4">
      {/* Content Tree */}
      <Card className="rounded-2xl border">
        <CardHeader className="pb-1">
          <CardTitle className="text-lg">Content Tree</CardTitle>
          <div className="text-sm text-slate-500">Data Sources</div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="space-y-1">
            {sources.map((s) => (
              <RowButton
                key={s.key}
                Icon={s.icon}
                text={s.label}
                onClick={() => handleClick(s.key)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Types */}
      <Card className="rounded-2xl border">
        <CardHeader className="pb-1">
          <CardTitle className="text-lg">Content Types</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="space-y-1">
            {contentTypes.map((t) => (
              <RowButton
                key={t.key}
                Icon={t.icon}
                text={t.label}
                onClick={() => handleClick(t.key)}
              />
            ))}
          </div>

          {/* Big CTA like the mock */}
          <div className="pt-4">
            <Button
              className="w-full h-12 rounded-xl bg-[#2E7FA3] hover:bg-[#256C8A] text-white font-semibold"
              onClick={() => handleClick("manage-content-sources")}
            >
              Manage Content Sources
            </Button>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
//==================================END 2nd DRAFT========================
