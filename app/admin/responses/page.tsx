'use client';

import React, { useState, useEffect } from 'react';
import InteractiveDashboard from '@/dashboard/InteractiveDashboard';
import { DashboardTable } from '@/dashboard/DashboardTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, Table, RefreshCw } from 'lucide-react';

interface SurveyResponse {
  _id: string;
  personalInfo: {
    name: string;
    age: number;
    gender: string;
    phone: string;
    email: string;
  };
  medicalHistory: {
    diagnosed: string;
    symptoms: string[];
    medications: string[];
    familyHistory: string;
  };
  lifestyle: {
    diet: string;
    exercise: string;
    sleep: string;
    stress: string;
  };
  submittedAt: string;
}

export default function ResponsesPage() {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isDarkTheme = true;
  const [activeTab, setActiveTab] = useState("table");

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/responses');
      const data = await response.json();

      if (data.success) {
        setResponses(data.data);
      } else {
        setError(data.error || 'Failed to fetch responses');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch responses');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: isDarkTheme ? '#181c2a' : '#f8fafc',
        color: isDarkTheme ? '#e1e7ef' : '#374151'
      }}>
        <Card className="p-8">
          <CardContent className="flex flex-col items-center space-y-4">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-lg font-medium">Loading survey responses...</p>
            <p className="text-sm text-gray-500">Please wait while we fetch the data</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: isDarkTheme ? '#181c2a' : '#f8fafc',
        color: isDarkTheme ? '#e1e7ef' : '#374151',
        flexDirection: 'column'
      }}>
        <Card className="p-8 max-w-md">
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="text-red-500 text-6xl">⚠️</div>
            <h1 className="text-2xl font-bold text-red-600">Error Loading Data</h1>
            <p className="text-center text-gray-600">{error}</p>
            <button
              onClick={fetchResponses}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retry</span>
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkTheme ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header with Gradient Background */}
      <div className="border-b shadow-sm bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Aaroha Meditech PVT LTD</h1>
              <p className="text-gray-700 mt-1">
                Manage and analyze {responses.length} survey responses
              </p>
            </div>
            
            {/* Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchResponses}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-800 bg-white/70 backdrop-blur-sm border border-white/50 rounded-md hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-sm"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <div className="bg-gradient-to-b from-purple-50/30 to-transparent p-6 rounded-lg mb-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="table" className="flex items-center space-x-2 data-[state=active]:bg-purple-100">
                <Table className="h-4 w-4" />
                <span>Responses Table</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center space-x-2 data-[state=active]:bg-purple-100">
                <BarChart3 className="h-4 w-4" />
                <span>Analytics Dashboard</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="table" className="space-y-4">
              <DashboardTable responses={responses} />
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-4">
              <InteractiveDashboard 
                responses={responses} 
                isDarkTheme={isDarkTheme}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}