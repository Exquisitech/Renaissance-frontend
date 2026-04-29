'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, TrendingDown, Activity } from 'lucide-react';

interface RiskMetricsProps {
  sharpeRatio: number;
  maxDrawdown: number;
  volatility: number;
  winRate: number;
  totalBets: number;
}

export default function RiskMetrics({
  sharpeRatio,
  maxDrawdown,
  volatility,
  winRate,
  totalBets,
}: RiskMetricsProps) {
  const getSharpeRating = (ratio: number) => {
    if (ratio >= 2) return { label: 'Excellent', color: 'text-green-500' };
    if (ratio >= 1) return { label: 'Good', color: 'text-blue-500' };
    if (ratio >= 0) return { label: 'Fair', color: 'text-yellow-500' };
    return { label: 'Poor', color: 'text-red-500' };
  };

  const getDrawdownRisk = (drawdown: number) => {
    if (drawdown <= 10) return { label: 'Low', color: 'text-green-500' };
    if (drawdown <= 20) return { label: 'Medium', color: 'text-yellow-500' };
    return { label: 'High', color: 'text-red-500' };
  };

  const sharpeRating = getSharpeRating(sharpeRatio);
  const drawdownRisk = getDrawdownRisk(maxDrawdown);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Risk Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium">Sharpe Ratio</p>
              <span className={`text-xs font-semibold ${sharpeRating.color}`}>
                {sharpeRating.label}
              </span>
            </div>
            <p className="text-2xl font-bold">{sharpeRatio.toFixed(2)}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Risk-adjusted returns
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium">Max Drawdown</p>
              <span className={`text-xs font-semibold ${drawdownRisk.color}`}>
                {drawdownRisk.label}
              </span>
            </div>
            <p className="text-2xl font-bold text-red-500">
              <TrendingDown className="mr-1 inline h-5 w-5" />
              {maxDrawdown.toFixed(2)}%
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Largest peak-to-trough decline
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium">Volatility</p>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold">{volatility.toFixed(2)}%</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Standard deviation of returns
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium">Win Rate</p>
              <span className={`text-xs font-semibold ${winRate >= 50 ? 'text-green-500' : 'text-red-500'}`}>
                {winRate >= 50 ? 'Profitable' : 'Unprofitable'}
              </span>
            </div>
            <p className={`text-2xl font-bold ${winRate >= 50 ? 'text-green-500' : 'text-red-500'}`}>
              {winRate.toFixed(1)}%
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              From {totalBets} total bets
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-muted p-4">
          <h4 className="mb-2 font-semibold">Risk Assessment Summary</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-green-500"></span>
              <span>
                <strong>Sharpe Ratio {sharpeRatio.toFixed(2)}:</strong> Your risk-adjusted returns are {sharpeRating.label.toLowerCase()}. 
                {sharpeRatio >= 1 ? ' This indicates good compensation for the risk taken.' : ' Consider strategies with better risk-reward ratios.'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className={`mt-1 h-2 w-2 rounded-full ${drawdownRisk.color}`}></span>
              <span>
                <strong>Max Drawdown {maxDrawdown.toFixed(2)}%:</strong> Your portfolio experienced a {drawdownRisk.label.toLowerCase()} maximum drawdown.
                {maxDrawdown > 20 ? ' This is relatively high and may indicate significant risk exposure.' : ' This is within acceptable risk levels.'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-blue-500"></span>
              <span>
                <strong>Volatility {volatility.toFixed(2)}%:</strong> 
                {volatility > 30 ? ' High volatility suggests significant price swings.' : volatility > 15 ? ' Moderate volatility indicates balanced risk.' : ' Low volatility suggests stable performance.'}
              </span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
