import React, { useEffect, useState } from 'react';
import { Trophy, Star, Lock, Zap, Target, Crown } from 'lucide-react';

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  requirement_type: string;
  requirement_value: number;
  reward_gc: number;
  reward_sc: number;
  unlocked?: boolean;
  unlockedAt?: string;
}

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, unlocked: 0, progress: 0 });

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await fetch('/api/achievements');
      const data = await response.json();
      setAchievements(data.achievements || []);

      const unlockedCount = (data.achievements || []).filter((a: Achievement) => a.unlocked).length;
      const total = data.achievements?.length || 0;
      setStats({
        total,
        unlocked: unlockedCount,
        progress: total > 0 ? Math.round((unlockedCount / total) * 100) : 0
      });
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (requirementType: string) => {
    switch (requirementType) {
      case 'win_count': return <Trophy className="w-8 h-8" />;
      case 'total_wagered': return <Zap className="w-8 h-8" />;
      case 'max_multiplier': return <Crown className="w-8 h-8" />;
      case 'game_played': return <Target className="w-8 h-8" />;
      default: return <Star className="w-8 h-8" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-slate-900 to-zinc-950 pt-8 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center gap-3">
            <Trophy className="w-10 h-10 text-amber-400" />
            Achievements
          </h1>
          <p className="text-gray-400 text-lg">Unlock badges and earn rewards by completing challenges</p>
        </div>

        {/* Progress */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Your Progress</h2>
              <p className="text-gray-400">{stats.unlocked} of {stats.total} achievements unlocked</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-amber-400">{stats.progress}%</div>
              <p className="text-gray-400">Complete</p>
            </div>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 to-amber-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.progress}%` }}
            />
          </div>
        </div>

        {/* Achievements Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="text-gray-400">Loading achievements...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`rounded-2xl p-6 border-2 transition-all ${
                  achievement.unlocked
                    ? 'bg-amber-500/10 border-amber-500 hover:border-amber-400'
                    : 'bg-zinc-900/30 border-zinc-800 hover:border-zinc-700 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${
                    achievement.unlocked
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-zinc-800 text-zinc-500'
                  }`}>
                    {achievement.unlocked ? getIcon(achievement.requirement_type) : <Lock className="w-8 h-8" />}
                  </div>
                  {achievement.unlocked && (
                    <div className="bg-amber-400/20 px-3 py-1 rounded-full text-amber-400 text-xs font-bold">
                      UNLOCKED
                    </div>
                  )}
                </div>

                <h3 className={`font-bold text-lg mb-2 ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`}>
                  {achievement.name}
                </h3>
                <p className="text-sm text-gray-400 mb-4">{achievement.description}</p>

                {/* Rewards */}
                <div className="flex gap-3 mb-4 text-sm">
                  {achievement.reward_gc > 0 && (
                    <div className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                      +{achievement.reward_gc.toLocaleString()} GC
                    </div>
                  )}
                  {achievement.reward_sc > 0 && (
                    <div className="bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded">
                      +{achievement.reward_sc.toLocaleString()} SC
                    </div>
                  )}
                </div>

                {/* Progress or Status */}
                {achievement.unlocked && achievement.unlockedAt && (
                  <div className="text-xs text-amber-400">
                    Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </div>
                )}

                {!achievement.unlocked && (
                  <div className="text-xs text-gray-500">
                    Requirement: {achievement.requirement_type.replace(/_/g, ' ')} ≥ {achievement.requirement_value}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tips */}
        <div className="mt-12 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400" />
            Achievement Tips
          </h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>• Play games to build your win count and wagering statistics</li>
            <li>• Look for big multipliers to unlock the Lucky Strike achievement</li>
            <li>• Participate in tournaments for exclusive challenges</li>
            <li>• Check back regularly as new achievements are added</li>
            <li>• Unlocked achievements grant bonus coins that are added to your account</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
