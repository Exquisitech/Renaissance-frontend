'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PortfolioOverview from '@/components/analytics/PortfolioOverview';
import PerformanceChart from '@/components/analytics/PerformanceChart';
import RiskMetrics from '@/components/analytics/RiskMetrics';
import BetHistory from '@/components/analytics/BetHistory';
import {
  getPortfolioOverview,
  getPerformanceData,
  getRiskMetrics,
  getBetHistory,
} from '@/lib/api/analytics';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [riskMetrics, setRiskMetrics] = useState<any>(null);
  const [betHistory, setBetHistory] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [portfolio, performance, risk, bets] = await Promise.all([
          getPortfolioOverview(),
          getPerformanceData(),
          getRiskMetrics(),
          getBetHistory(1, 100),
        ]);

        setPortfolioData(portfolio);
        setPerformanceData(performance);
        setRiskMetrics(risk);
        setBetHistory(bets.bets);
      } catch (error) {
        console.error('Error loading analytics data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleExportCSV = async () => {
    try {
      const blob = await import('@/lib/api/analytics').then((mod) =>
        mod.exportAnalyticsReport('csv')
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'analytics_report.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Portfolio</h1>
          <p className="mt-1 text-muted-foreground">
            Track your performance, risk metrics, and betting history
          </p>
        </div>
        <Button onClick={handleExportCSV} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="risk">Risk Metrics</TabsTrigger>
          <TabsTrigger value="history">Bet History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {portfolioData && <PortfolioOverview {...portfolioData} />}
          {performanceData.length > 0 && <PerformanceChart data={performanceData} />}
        </TabsContent>

        <TabsContent value="performance">
          {performanceData.length > 0 && <PerformanceChart data={performanceData} />}
        </TabsContent>

        <TabsContent value="risk">
          {riskMetrics && <RiskMetrics {...riskMetrics} />}
        </TabsContent>

        <TabsContent value="history">
          <BetHistory bets={betHistory} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
