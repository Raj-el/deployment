
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Construction, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function UnderDevelopment({ title = "Under Development" }: { title?: string }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center font-['Poppins']">
      <Card className="w-full max-w-md text-center card-3d">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Construction className="w-8 h-8 text-orange-600" />
          </div>
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            This feature is currently under development and will be available soon.
          </p>
          <div className="pt-4">
            <Button 
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
