
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Users, MessageSquare, CheckCircle, Target, TrendingUp, AlertCircle } from 'lucide-react';

const mockPlan = {
  id: '1',
  customerName: 'Acme Corporation',
  status: 'In Progress',
  progress: 65,
  healthScoreImprovement: '+12%',
  tasks: [
    { id: '1', title: 'Schedule executive alignment call', completed: true, assignee: 'Sarah Johnson', dueDate: '2024-02-01' },
    { id: '2', title: 'Conduct usage training session', completed: true, assignee: 'Mike Chen', dueDate: '2024-02-03' },
    { id: '3', title: 'Review contract terms', completed: false, assignee: 'Emma Wilson', dueDate: '2024-02-05' },
    { id: '4', title: 'Weekly check-in calls', completed: false, assignee: 'Sarah Johnson', dueDate: '2024-02-08' },
  ],
};

export function PlanDetails() {
  const { planId } = useParams();
  const [tasks, setTasks] = useState(mockPlan.tasks);

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-['Poppins']">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{mockPlan.customerName} - Get-Well Plan</h1>
          <div className="flex items-center space-x-4">
            <Badge variant="default">{mockPlan.status}</Badge>
            <span className="text-gray-600">Plan ID: {planId}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Health Score Improvement</div>
          <div className="text-2xl font-bold text-green-600">{mockPlan.healthScoreImprovement}</div>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="card-3d">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Plan Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{mockPlan.progress}%</span>
            </div>
            <Progress value={mockPlan.progress} className="h-3" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">2</div>
                <div className="text-sm text-gray-600">Completed Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">2</div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">15</div>
                <div className="text-sm text-gray-600">Days Remaining</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Content */}
      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <Card className="card-3d">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Action Items</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                    />
                    <div className="flex-1">
                      <div className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{task.assignee}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <Card className="card-3d">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>AI-Generated Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Success Probability</h4>
                  <p className="text-sm">Based on similar accounts, this plan has an 85% success probability.</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Positive Indicators</h4>
                  <p className="text-sm">Executive engagement has increased by 40% since plan initiation.</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">Risk Factors</h4>
                  <p className="text-sm">Contract renewal is approaching in 60 days. Prioritize value demonstration.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card className="card-3d">
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium">Executive call completed</div>
                    <div className="text-sm text-gray-600">Feb 1, 2024 - High engagement, positive feedback</div>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium">Training session delivered</div>
                    <div className="text-sm text-gray-600">Feb 3, 2024 - 12 participants, 90% completion</div>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium">Contract review scheduled</div>
                    <div className="text-sm text-gray-600">Feb 5, 2024 - Pending legal team availability</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="card-3d">
              <CardHeader>
                <CardTitle>Health Score Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-3xl font-bold text-green-600">↗ +12%</div>
                  <div className="text-sm text-gray-600">Since plan start</div>
                </div>
              </CardContent>
            </Card>
            <Card className="card-3d">
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Login Frequency</span>
                    <span className="text-green-600">+25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Feature Usage</span>
                    <span className="text-green-600">+18%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Support Tickets</span>
                    <span className="text-red-600">-30%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
