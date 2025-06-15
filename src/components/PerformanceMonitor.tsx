
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Wifi, WifiOff, Database, Clock } from 'lucide-react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'offline';
}

export const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    connectionQuality: 'good'
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Measure initial load time
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const loadTime = navigation.loadEventEnd - navigation.loadEventStart;

    // Measure render time
    const renderStart = performance.now();
    
    setTimeout(() => {
      const renderTime = performance.now() - renderStart;
      
      // Get memory usage (if available)
      const memoryUsage = (performance as any).memory 
        ? (performance as any).memory.usedJSHeapSize / 1024 / 1024 
        : 0;

      setMetrics(prev => ({
        ...prev,
        loadTime,
        renderTime,
        memoryUsage
      }));
    }, 0);

    // Monitor connection quality
    const updateConnectionQuality = () => {
      if (!navigator.onLine) {
        setMetrics(prev => ({ ...prev, connectionQuality: 'offline' }));
        return;
      }

      // Simple connection test using a basic fetch
      const start = performance.now();
      fetch('/', { method: 'HEAD' })
        .then(() => {
          const latency = performance.now() - start;
          const quality = latency < 100 ? 'excellent' : latency < 300 ? 'good' : 'poor';
          setMetrics(prev => ({ ...prev, connectionQuality: quality }));
        })
        .catch(() => {
          setMetrics(prev => ({ ...prev, connectionQuality: 'poor' }));
        });
    };

    updateConnectionQuality();
    const interval = setInterval(updateConnectionQuality, 30000);

    // Show monitor in development or when performance is poor
    const shouldShow = process.env.NODE_ENV === 'development' || 
                     loadTime > 3000 || 
                     metrics.renderTime > 100;
    setIsVisible(shouldShow);

    return () => clearInterval(interval);
  }, []);

  const getConnectionIcon = () => {
    switch (metrics.connectionQuality) {
      case 'excellent':
      case 'good':
        return <Wifi className="h-4 w-4 text-green-600" />;
      case 'poor':
        return <Wifi className="h-4 w-4 text-yellow-600" />;
      case 'offline':
        return <WifiOff className="h-4 w-4 text-red-600" />;
    }
  };

  const getConnectionColor = () => {
    switch (metrics.connectionQuality) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'poor': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-red-100 text-red-800';
    }
  };

  if (!isVisible) return null;

  return (
    <Card className="fixed bottom-4 right-4 w-80 shadow-lg border-2 border-blue-200 bg-blue-50/90 backdrop-blur-sm z-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Performance Monitor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 text-blue-600" />
            <div>
              <p className="text-xs text-muted-foreground">Load Time</p>
              <p className="text-sm font-medium">{metrics.loadTime.toFixed(0)}ms</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Database className="h-3 w-3 text-purple-600" />
            <div>
              <p className="text-xs text-muted-foreground">Memory</p>
              <p className="text-sm font-medium">{metrics.memoryUsage.toFixed(1)}MB</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Connection</span>
          <Badge className={`${getConnectionColor()} flex items-center gap-1`}>
            {getConnectionIcon()}
            {metrics.connectionQuality}
          </Badge>
        </div>

        {(metrics.loadTime > 3000 || metrics.renderTime > 100) && (
          <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
            ⚠️ Performance issues detected. Consider optimizing.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
