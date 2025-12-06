
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AIChatbot } from '@/components/shared/AIChatbot';
import { 
  ArrowRight, 
  BarChart3, 
  Users, 
  Target, 
  MessageSquare,
  Zap,
  Shield,
  TrendingUp
} from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    title: 'Health Score Analytics',
    description: 'FUSE methodology for comprehensive customer health tracking',
    color: 'text-blue-600 bg-blue-100'
  },
  {
    icon: Target,
    title: 'Get-Well Plans',
    description: 'AI-powered customer recovery and intervention strategies',
    color: 'text-green-600 bg-green-100'
  },
  {
    icon: MessageSquare,
    title: 'CS Query Assistant',
    description: 'Intelligent Q&A system for customer success best practices',
    color: 'text-purple-600 bg-purple-100'
  },
  {
    icon: Users,
    title: 'Expert Consultation',
    description: 'Connect with CS experts for specialized guidance',
    color: 'text-orange-600 bg-orange-100'
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 font-['Poppins']">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DA</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SetuCS</h1>
                <p className="text-xs text-gray-600">Powered by SetuCS</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link to="/dashboard">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Customer Success
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {' '}Platform
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                Empower your customer success team with AI-driven insights, health score analytics, 
                and intelligent intervention strategies to reduce churn and drive growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/dashboard">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg">
                  Watch Demo
                </Button>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="card-3d hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Stats Section */}
            <Card className="card-3d bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="text-3xl font-bold mb-2">94%</div>
                    <div className="text-blue-100">Customer Retention Rate</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">25%</div>
                    <div className="text-blue-100">Increase in Expansion Revenue</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">50%</div>
                    <div className="text-blue-100">Reduction in Churn</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Features */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 text-center">
                Everything You Need for Customer Success
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border">
                  <Zap className="w-6 h-6 text-yellow-500" />
                  <div>
                    <h3 className="font-semibold">AI-Powered Insights</h3>
                    <p className="text-sm text-gray-600">Intelligent recommendations</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border">
                  <Shield className="w-6 h-6 text-green-500" />
                  <div>
                    <h3 className="font-semibold">Enterprise Security</h3>
                    <p className="text-sm text-gray-600">Bank-level encryption</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                  <div>
                    <h3 className="font-semibold">Real-time Analytics</h3>
                    <p className="text-sm text-gray-600">Live data monitoring</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Assistant Demo */}
            <AIChatbot 
              title="Try Our AI Assistant"
              placeholder="Ask about customer success strategies..."
            />

            {/* Quick Links */}
            <Card className="card-3d">
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/dashboard" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Dashboard
                  </Button>
                </Link>
                <Link to="/health-scores" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Target className="w-4 h-4 mr-2" />
                    Health Scores
                  </Button>
                </Link>
                <Link to="/cs-query" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    CS Query
                  </Button>
                </Link>
                <Link to="/get-well-plans" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Get-Well Plans
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="card-3d">
              <CardHeader>
                <CardTitle>Get Started Today</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Ready to transform your customer success operations? Contact our team for a personalized demo.
                </p>
                <div className="space-y-2">
                  <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                    Schedule Demo
                  </Button>
                  <Button variant="outline" className="w-full">
                    Contact Sales
                  </Button>
                </div>
                <div className="text-center text-sm text-gray-500">
                  <p>No credit card required</p>
                  <p>Free 14-day trial</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">DA</span>
                </div>
                <div>
                  <h3 className="font-bold">SetuCS</h3>
                  <p className="text-xs text-gray-400">Powered by SetuCS</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering customer success teams with AI-driven insights and intelligent automation.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/health-scores" className="hover:text-white">Health Scores</Link></li>
                <li><Link to="/get-well-plans" className="hover:text-white">Get-Well Plans</Link></li>
                <li><Link to="/cs-query" className="hover:text-white">CS Query</Link></li>
                <li><Link to="/analytics" className="hover:text-white">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">API Reference</a></li>
                <li><a href="#" className="hover:text-white">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><Link to="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-white">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 mt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 DataAnalytics SetuCS Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
