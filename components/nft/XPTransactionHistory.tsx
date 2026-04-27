"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Star,
  Trophy,
  Target,
  Gift,
  RotateCcw
} from "lucide-react";
import { XPTransaction, XPReason } from "@/lib/api/nft";

interface XPTransactionHistoryProps {
  transactions: XPTransaction[];
  totalXP: number;
  currentLevel: number;
  className?: string;
}

export function XPTransactionHistory({
  transactions,
  totalXP,
  currentLevel,
  className,
}: XPTransactionHistoryProps) {
  const [filter, setFilter] = useState<XPReason | "all">("all");

  const filteredTransactions = filter === "all"
    ? transactions
    : transactions.filter((t) => t.reason === filter);

  const getTotalXPByReason = (reason: XPReason) => {
    return transactions
      .filter((t) => t.reason === reason)
      .reduce((sum, t) => sum + t.xpAmount, 0);
  };

  const getXPReasonIcon = (reason: XPReason) => {
    switch (reason) {
      case "stake_win":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "stake_loss":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case "daily_login":
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case "prediction_correct":
        return <Target className="h-4 w-4 text-purple-500" />;
      case "tournament_reward":
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case "manual_grant":
        return <Gift className="h-4 w-4 text-pink-500" />;
      case "prestige_reset":
        return <RotateCcw className="h-4 w-4 text-orange-500" />;
    }
  };

  const getXPReasonColor = (reason: XPReason) => {
    switch (reason) {
      case "stake_win":
        return "text-green-600";
      case "stake_loss":
        return "text-red-600";
      case "daily_login":
        return "text-blue-600";
      case "prediction_correct":
        return "text-purple-600";
      case "tournament_reward":
        return "text-yellow-600";
      case "manual_grant":
        return "text-pink-600";
      case "prestige_reset":
        return "text-orange-600";
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              XP History
            </CardTitle>
            <CardDescription>
              Track your XP gains and progression
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">{totalXP.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total XP • Level {currentLevel}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-lg bg-green-50 dark:bg-green-950/20 p-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium">Stake Wins</span>
            </div>
            <p className="mt-1 text-lg font-bold text-green-600">
              +{getTotalXPByReason("stake_win").toLocaleString()}
            </p>
          </div>
          
          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium">Daily Logins</span>
            </div>
            <p className="mt-1 text-lg font-bold text-blue-600">
              +{getTotalXPByReason("daily_login").toLocaleString()}
            </p>
          </div>
          
          <div className="rounded-lg bg-purple-50 dark:bg-purple-950/20 p-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-600" />
              <span className="text-xs font-medium">Predictions</span>
            </div>
            <p className="mt-1 text-lg font-bold text-purple-600">
              +{getTotalXPByReason("prediction_correct").toLocaleString()}
            </p>
          </div>
          
          <div className="rounded-lg bg-yellow-50 dark:bg-yellow-950/20 p-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-600" />
              <span className="text-xs font-medium">Tournaments</span>
            </div>
            <p className="mt-1 text-lg font-bold text-yellow-600">
              +{getTotalXPByReason("tournament_reward").toLocaleString()}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <Tabs defaultValue="all" onValueChange={(value) => setFilter(value as XPReason | "all")}>
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            <TabsTrigger value="stake_win" className="flex-1">Wins</TabsTrigger>
            <TabsTrigger value="daily_login" className="flex-1">Daily</TabsTrigger>
            <TabsTrigger value="tournament_reward" className="flex-1">Tournaments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <TransactionList 
              transactions={filteredTransactions}
              getXPReasonIcon={getXPReasonIcon}
              getXPReasonColor={getXPReasonColor}
              formatDate={formatDate}
            />
          </TabsContent>
          
          <TabsContent value="stake_win" className="mt-4">
            <TransactionList 
              transactions={filteredTransactions}
              getXPReasonIcon={getXPReasonIcon}
              getXPReasonColor={getXPReasonColor}
              formatDate={formatDate}
            />
          </TabsContent>
          
          <TabsContent value="daily_login" className="mt-4">
            <TransactionList 
              transactions={filteredTransactions}
              getXPReasonIcon={getXPReasonIcon}
              getXPReasonColor={getXPReasonColor}
              formatDate={formatDate}
            />
          </TabsContent>
          
          <TabsContent value="tournament_reward" className="mt-4">
            <TransactionList 
              transactions={filteredTransactions}
              getXPReasonIcon={getXPReasonIcon}
              getXPReasonColor={getXPReasonColor}
              formatDate={formatDate}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

interface TransactionListProps {
  transactions: XPTransaction[];
  getXPReasonIcon: (reason: XPReason) => React.ReactNode;
  getXPReasonColor: (reason: XPReason) => string;
  formatDate: (date: Date) => string;
}

function TransactionList({
  transactions,
  getXPReasonIcon,
  getXPReasonColor,
  formatDate,
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <Star className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <p className="mt-2 text-sm">No XP transactions found</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-2">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                {getXPReasonIcon(transaction.reason)}
              </div>
              <div>
                <p className="text-sm font-medium">{transaction.description}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(transaction.date)}
                </p>
              </div>
            </div>
            <Badge variant="outline" className={`font-bold ${getXPReasonColor(transaction.reason)}`}>
              +{transaction.xpAmount} XP
            </Badge>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
