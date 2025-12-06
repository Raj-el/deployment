
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Mail, 
  MessageSquare, 
  FileText, 
  Calendar,
  CheckCircle,
  ArrowLeft,
  Plus,
  Globe,
  Key
} from 'lucide-react';

const availableConnectors = [
  { id: 'salesforce', name: 'Salesforce CRM', icon: Database, category: 'CRM', description: 'Connect to Salesforce for customer data' },
  { id: 'hubspot', name: 'HubSpot CRM', icon: Database, category: 'CRM', description: 'Import contacts and deals from HubSpot' },
  { id: 'outlook', name: 'Microsoft Outlook', icon: Mail, category: 'Email', description: 'Sync emails and calendar events' },
  { id: 'gmail', name: 'Gmail', icon: Mail, category: 'Email', description: 'Connect Gmail for email analytics' },
  { id: 'slack', name: 'Slack', icon: MessageSquare, category: 'Communication', description: 'Monitor team communication' },
  { id: 'teams', name: 'Microsoft Teams', icon: MessageSquare, category: 'Communication', description: 'Teams chat and meeting data' },
  { id: 'confluence', name: 'Confluence', icon: FileText, category: 'Documentation', description: 'Access knowledge base content' },
  { id: 'notion', name: 'Notion', icon: FileText, category: 'Documentation', description: 'Import documentation and notes' },
  { id: 'gcal', name: 'Google Calendar', icon: Calendar, category: 'Calendar', description: 'Sync calendar events and meetings' },
  { id: 'zendesk', name: 'Zendesk', icon: Globe, category: 'Support', description: 'Customer support ticket data' },
];

interface AddDataSourceProps {
  onBack: () => void;
}

export function AddDataSource({ onBack }: AddDataSourceProps) {
  const [selectedConnector, setSelectedConnector] = useState<string | null>(null);
  const [connectionName, setConnectionName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [serverUrl, setServerUrl] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'CRM', 'Email', 'Communication', 'Documentation', 'Calendar', 'Support'];
  
  const filteredConnectors = selectedCategory === 'all' 
    ? availableConnectors 
    : availableConnectors.filter(c => c.category === selectedCategory);

  const selectedConnectorData = availableConnectors.find(c => c.id === selectedConnector);

  const handleConnect = () => {
    console.log('Connecting to:', {
      connector: selectedConnector,
      name: connectionName,
      apiKey,
      serverUrl,
      description
    });
    // Here you would implement the actual connection logic
    alert('Data source connected successfully!');
    onBack();
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Add Data Source</h2>
          <p className="text-gray-600">Connect a new data source to your platform</p>
        </div>
      </div>

      {!selectedConnector ? (
        <div className="space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer capitalize"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Available Connectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredConnectors.map((connector) => (
              <Card 
                key={connector.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                onClick={() => setSelectedConnector(connector.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <connector.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{connector.name}</h3>
                      <Badge variant="outline" className="text-xs">{connector.category}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{connector.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  {selectedConnectorData && <selectedConnectorData.icon className="w-5 h-5 text-blue-600" />}
                </div>
                <div>
                  <CardTitle>{selectedConnectorData?.name}</CardTitle>
                  <p className="text-sm text-gray-600">{selectedConnectorData?.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="connectionName">Connection Name</Label>
                <Input
                  id="connectionName"
                  value={connectionName}
                  onChange={(e) => setConnectionName(e.target.value)}
                  placeholder="My Salesforce Connection"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key / Access Token</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serverUrl">Server URL (Optional)</Label>
                <Input
                  id="serverUrl"
                  value={serverUrl}
                  onChange={(e) => setServerUrl(e.target.value)}
                  placeholder="https://yourinstance.salesforce.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of this connection"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-3 pt-4">
                <Button 
                  onClick={handleConnect}
                  disabled={!connectionName || !apiKey}
                  className="bg-gradient-to-r from-green-600 to-blue-600"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Connect Data Source
                </Button>
                <Button variant="outline" onClick={() => setSelectedConnector(null)}>
                  Back to Selection
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
