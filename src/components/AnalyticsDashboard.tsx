
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAnalytics } from '@/hooks/useAnalytics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, MessageSquare, Award } from 'lucide-react';

export const AnalyticsDashboard = () => {
  const { getAnalyticsData } = useAnalytics();
  const events = getAnalyticsData();

  // Process analytics data
  const pageViews = events.filter(e => e.event_type === 'page_view');
  const interactions = events.filter(e => e.event_type === 'user_interaction');
  const qualityAnalyses = events.filter(e => e.event_type === 'argument_quality_analysis');

  // Aggregate page views by page
  const pageViewData = pageViews.reduce((acc, event) => {
    const page = event.event_data?.page || 'unknown';
    acc[page] = (acc[page] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(pageViewData).map(([page, count]) => ({
    page: page.replace('/', '') || 'home',
    views: count
  }));

  // Quality score distribution
  const qualityDistribution = qualityAnalyses.reduce((acc, event) => {
    const category = event.event_data?.quality_category || 'unknown';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const qualityData = Object.entries(qualityDistribution).map(([category, count]) => ({
    name: category,
    value: count
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Recent activity (last 24 hours)
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentEvents = events.filter(e => new Date(e.timestamp) > yesterday);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pageViews.length}</div>
            <p className="text-xs text-muted-foreground">
              +{recentEvents.filter(e => e.event_type === 'page_view').length} last 24h
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">User Interactions</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{interactions.length}</div>
            <p className="text-xs text-muted-foreground">
              +{recentEvents.filter(e => e.event_type === 'user_interaction').length} last 24h
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Quality Analyses</CardTitle>
              <Award className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qualityAnalyses.length}</div>
            <p className="text-xs text-muted-foreground">
              +{recentEvents.filter(e => e.event_type === 'argument_quality_analysis').length} last 24h
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Avg Quality Score</CardTitle>
              <MessageSquare className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {qualityAnalyses.length > 0 
                ? (qualityAnalyses.reduce((sum, e) => sum + (e.event_data?.quality_score || 0), 0) / qualityAnalyses.length).toFixed(1)
                : 'N/A'
              }
            </div>
            <p className="text-xs text-muted-foreground">out of 100</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Page Views by Page</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="page" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Argument Quality Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={qualityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {qualityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentEvents.slice(-10).reverse().map((event, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{event.event_type}</Badge>
                  <span className="text-sm">
                    {event.event_data?.page || event.event_data?.interaction || 'Activity'}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
            {recentEvents.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No recent activity recorded
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
