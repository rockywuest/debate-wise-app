
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ExternalLink } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-[#F8F7F4] text-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-[#2563EB] hover:underline mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to debate wise
          </Link>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                The privacy policy for this website is available on the FRECH & WUEST website 'debate wise' is a service of the FRECH & WUEST GmbH.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild>
                  <a href="https://frechundwuest.de/datenschutz/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                    View Privacy Policy
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                
                <Button variant="outline" asChild>
                  <Link to="/dashboard">
                    Stay on debate wise
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
