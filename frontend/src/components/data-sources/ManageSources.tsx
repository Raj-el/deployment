
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Database, 
  Mail, 
  MessageSquare, 
  FileText, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Settings,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  ArrowLeft,
  MoreVertical
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const managedSources = [
  { 
    id: 1,
    name: 'Primary Salesforce', 
    icon: Database, 
    status: 'connected', 
    lastSync: '2 min ago',
    type: 'CRM',
    recordsCount: 15420,
    health: 'good'
  },
  { 
    id: 2,
    name: 'Marketing Outlook', 
    icon: Mail, 
    status: 'connected', 
    lastSync: '5 min ago',
    type: 'Email',
    recordsCount: 8750,
    health: 'good'
  },
  { 
    id: 3,
    name: 'Team Slack Workspace', 
    icon: MessageSquare, 
    status: 'syncing', 
    lastSync: 'Syncing...',
    type: 'Communication',
    recordsCount: 3200,
    health: 'fair'
  },
  { 
    id: 4,
    name: 'Knowledge Base', 
    icon: FileText, 
    status: 'error', 
    lastSync: '2 hours ago',
    type: 'Documentation',
    recordsCount: 890,
    health: 'poor'
  },
  { 
    id: 5,
    name: 'Executive Calendar', 
    icon: Calendar, 
    status: 'connected', 
    lastSync: '1 min ago',
    type: 'Calendar',
    recordsCount: 456,
    health: 'excellent'
  },
  { 
    id: 6,
    name: 'Support HubSpot', 
    icon: Database, 
    status: 'paused', 
    lastSync: '1 day ago',
    type: 'CRM',
    recordsCount: 5670,
    health: 'fair'
  },
];

interface ManageSourcesProps {
  onBack: () => void;
}

export function ManageSources({ onBack }: ManageSourcesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'syncing':
        return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'paused':
        return <Clock className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'syncing':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'paused':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800';
      case 'poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSources = managedSources.filter(source => {
    const matchesSearch = source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         source.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || source.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSync = (sourceId: number) => {
    console.log('Syncing source:', sourceId);
    alert('Sync started for data source');
  };

  const handlePause = (sourceId: number) => {
    console.log('Pausing source:', sourceId);
    alert('Data source paused');
  };

  const handleDelete = (sourceId: number) => {
    if (confirm('Are you sure you want to delete this data source?')) {
      console.log('Deleting source:', sourceId);
      alert('Data source deleted');
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Data Sources</h2>
          <p className="text-gray-600">Monitor and configure your connected data sources</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top 1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search data sources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="connected">Connected</option>
            <option value="syncing">Syncing</option>
            <option value="error">Error</option>
            <option value="paused">Paused</option>
          </select>
        </div>
      </div>

      {/* Data Sources Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSources.map((source) => (
          <Card key={source.id} className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <source.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{source.name}</CardTitle>
                    <Badge variant="outline" className="text-xs">{source.type}</Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleSync(source.id)}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Sync Now
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handlePause(source.id)}>
                      <Clock className="w-4 h-4 mr-2" />
                      Pause
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      Configure
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(source.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(source.status)}
                  <Badge className={getStatusColor(source.status)} variant="secondary">
                    {source.status}
                  </Badge>
                </div>
                <Badge className={getHealthColor(source.health)} variant="secondary">
                  {source.health}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Sync:</span>
                  <span className="font-medium">{source.lastSync}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Records:</span>
                  <span className="font-medium">{source.recordsCount.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => handleSync(source.id)}>
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Sync
                </Button>
                <Button size="sm" variant="outline">
                  <Settings className="w-3 h-3 mr-1" />
                  Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSources.length === 0 && (
        <div className="text-center py-12">
          <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No data sources found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}
