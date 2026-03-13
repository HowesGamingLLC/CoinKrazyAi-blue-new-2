import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { History, Zap, Trophy, TrendingUp, Loader2 } from 'lucide-react';
import { Card } from './ui/Card';

interface GameResult {
  id: number;
  game_id: number;
  game_name?: string;
  bet_amount: number;
  win_amount: number;
  currency: string;
  multiplier: number;
  created_at: string;
}

export function RecentActivity() {
  const { data: gameResults, isLoading, error } = useQuery({
    queryKey: ['recent-games'],
    queryFn: async () => {
      const res = await fetch('/api/stats/wagered-history');
      if (!res.ok) throw new Error('Failed to fetch game history');
      return res.json();
    }
  });

  const results = (gameResults?.results || []).slice(0, 5);
  const currencyIcon = (currency: string) => currency === 'gc' ? '💰' : '🎴';
  
  const getGameColor = (multiplier: number) => {
    if (multiplier > 5) return 'text-amber-400';
    if (multiplier > 2) return 'text-emerald-400';
    if (multiplier > 0) return 'text-blue-400';
    return 'text-gray-400';
  };

  const getGameIcon = (multiplier: number) => {
    if (multiplier > 5) return <Trophy className="w-5 h-5" />;
    if (multiplier > 2) return <TrendingUp className="w-5 h-5" />;
    return <Zap className="w-5 h-5" />;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <History className="w-5 h-5 text-purple-500" />
        <h3 className="font-bold text-white">Recent Games</h3>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-sm text-red-400">Failed to load game history</div>
      ) : results.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          No games played yet. Start playing to see your history!
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((result) => (
            <div
              key={result.id}
              className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center ${getGameColor(result.multiplier)}`}>
                  {getGameIcon(result.multiplier)}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">
                    {result.game_name || 'Game'} ({result.currency.toUpperCase()})
                  </div>
                  <div className="text-[10px] text-slate-500">{formatTime(result.created_at)}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-bold ${result.win_amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {result.win_amount > 0 ? '+' : '-'}{Math.abs(result.win_amount).toFixed(2)} {result.currency.toUpperCase()}
                </div>
                <div className="text-[10px] text-slate-500">
                  {result.multiplier > 0 ? `${result.multiplier.toFixed(2)}x` : 'Loss'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
