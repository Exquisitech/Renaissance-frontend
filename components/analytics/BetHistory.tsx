'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { useState } from 'react';
import { Search, Download, Filter } from 'lucide-react';

interface Bet {
  id: string;
  date: string;
  type: string;
  stake: number;
  odds: number;
  result: 'win' | 'loss' | 'pending';
  profit: number;
  status: string;
}

interface BetHistoryProps {
  bets: Bet[];
}

export default function BetHistory({ bets }: BetHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [resultFilter, setResultFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredBets = bets.filter((bet) => {
    const matchesSearch =
      bet.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bet.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesResult = resultFilter === 'all' || bet.result === resultFilter;
    const matchesType = typeFilter === 'all' || bet.type === typeFilter;
    return matchesSearch && matchesResult && matchesType;
  });

  const exportToCSV = () => {
    const headers = ['ID', 'Date', 'Type', 'Stake', 'Odds', 'Result', 'Profit', 'Status'];
    const rows = filteredBets.map((bet) => [
      bet.id,
      bet.date,
      bet.type,
      bet.stake.toString(),
      bet.odds.toString(),
      bet.result,
      bet.profit.toString(),
      bet.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.join(','))].join('\\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'bet_history.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'win':
        return 'text-green-500';
      case 'loss':
        return 'text-red-500';
      case 'pending':
        return 'text-yellow-500';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Bet History</CardTitle>
          <Button onClick={exportToCSV} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select
            value={resultFilter}
            onValueChange={setResultFilter}
            options={[
              { value: 'all', label: 'All Results' },
              { value: 'win', label: 'Wins' },
              { value: 'loss', label: 'Losses' },
              { value: 'pending', label: 'Pending' },
            ]}
            placeholder="Filter by result"
            className="w-full sm:w-[180px]"
          />
          <Select
            value={typeFilter}
            onValueChange={setTypeFilter}
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'sports', label: 'Sports' },
              { value: 'casino', label: 'Casino' },
              { value: 'predictions', label: 'Predictions' },
            ]}
            placeholder="Filter by type"
            className="w-full sm:w-[180px]"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="pb-3 text-left text-sm font-medium">ID</th>
                <th className="pb-3 text-left text-sm font-medium">Date</th>
                <th className="pb-3 text-left text-sm font-medium">Type</th>
                <th className="pb-3 text-right text-sm font-medium">Stake</th>
                <th className="pb-3 text-right text-sm font-medium">Odds</th>
                <th className="pb-3 text-center text-sm font-medium">Result</th>
                <th className="pb-3 text-right text-sm font-medium">Profit/Loss</th>
              </tr>
            </thead>
            <tbody>
              {filteredBets.map((bet) => (
                <tr key={bet.id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="py-3 text-sm font-mono">{bet.id}</td>
                  <td className="py-3 text-sm">{bet.date}</td>
                  <td className="py-3 text-sm capitalize">{bet.type}</td>
                  <td className="py-3 text-right text-sm">${bet.stake.toFixed(2)}</td>
                  <td className="py-3 text-right text-sm">{bet.odds.toFixed(2)}</td>
                  <td className={`py-3 text-center text-sm font-semibold ${getResultColor(bet.result)}`}>
                    {bet.result.toUpperCase()}
                  </td>
                  <td className={`py-3 text-right text-sm font-semibold ${bet.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {bet.profit >= 0 ? '+' : ''}${bet.profit.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBets.length === 0 && (
          <div className="py-12 text-center">
            <Filter className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium">No bets found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <p>Showing {filteredBets.length} of {bets.length} bets</p>
        </div>
      </CardContent>
    </Card>
  );
}
