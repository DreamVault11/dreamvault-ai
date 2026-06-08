'use client';

import React from 'react';
import { 
  Moon, 
  Zap, 
  Video, 
  BarChart3, 
  Sparkles, 
  Brain, 
  Clock, 
  ChevronRight,
  TrendingUp,
  Smile,
  Ghost,
  History,
  Compass,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { DreamCard } from '@/components/ui/DreamCard';
import { DreamGradientText } from '@/components/ui/DreamGradientText';
import { DreamStreakBadge } from '@/components/ui/DreamStreakBadge';
import { DreamButton } from '@/components/ui/DreamButton';
import { AnalyticsResponse } from '@/types/dream';
import { cn } from '@/lib/utils';

// Mock data
const mockAnalytics: AnalyticsResponse = {
  total_dreams: 42,
  current_streak: 7,
  longest_streak: 12,
  top_emotions: [
    { name: 'Wonder', count: 12 },
    { name: 'Calm', count: 8 },
    { name: 'Anxiety', count: 5 },
    { name: 'Excitement', count: 4 },
  ],
  top_symbols: [
    { name: 'Ocean', count: 6 },
    { name: 'Flying', count: 4 },
    { name: 'Old House', count: 3 },
    { name: 'Clock', count: 2 },
  ],
  top_characters: [
    { name: 'The Stranger', count: 5 },
    { name: 'Old Friend', count: 3 },
    { name: 'Talking Cat', count: 2 },
  ],
  top_locations: [
    { name: 'Neon City', count: 7 },
    { name: 'Deep Forest', count: 4 },
    { name: 'Floating Island', count: 3 },
  ],
  dream_frequency: [
    { date: '2023-10-20', count: 82 },
    { date: '2023-10-21', count: 91 },
    { date: '2023-10-22', count: 78 },
    { date: '2023-10-23', count: 85 },
    { date: '2023-10-24', count: 89 },
    { date: '2023-10-25', count: 94 },
    { date: '2023-10-26', count: 88 },
  ],
  lucid_dreams_percentage: 15,
  nightmare_percentage: 10,
  movie_generations: 18,
};

const averageRecallScore = 87;

const recentDreams = [
  {
    id: '1',
    title: 'The Neon Cathedral',
    date: 'Oct 26, 2023',
    emotion: 'Wonder',
    completeness: 94,
    hasMovie: true,
  },
  {
    id: '2',
    title: 'Running from Silence',
    date: 'Oct 25, 2023',
    emotion: 'Anxiety',
    completeness: 68,
    hasMovie: false,
  },
  {
    id: '3',
    title: 'The Underwater Library',
    date: 'Oct 24, 2023',
    emotion: 'Calm',
    completeness: 88,
    hasMovie: true,
  },
  {
    id: '4',
    title: 'Gravity Protocol',
    date: 'Oct 23, 2023',
    emotion: 'Wonder',
    completeness: 91,
    hasMovie: true,
  },
  {
    id: '5',
    title: 'Forgotten Dialects',
    date: 'Oct 22, 2023',
    emotion: 'Curiosity',
    completeness: 75,
    hasMovie: false,
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 pt-24 pb-32 max-w-6xl">
      {/* Header & Stats Bar */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8 mb-12"
      >
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Your <DreamGradientText>Dreamscape</DreamGradientText>
            </h1>
            <p className="text-white/60 mt-2 text-lg">
              Insights from your subconscious ritual.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
             <DreamStreakBadge streak={mockAnalytics.current_streak} className="h-10 px-4 text-sm" />
             <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm font-bold">
               <Zap className="w-4 h-4 text-primary" />
               <span>{mockAnalytics.longest_streak}d Longest</span>
             </div>
          </div>
        </motion.div>

        {/* Top Stats Bar */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <DreamCard className="p-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/20" glow>
            <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Total Dreams</div>
            <div className="text-4xl font-bold text-white">{mockAnalytics.total_dreams}</div>
            <Moon className="absolute right-4 bottom-4 w-10 h-10 text-white/5" />
          </DreamCard>

          <DreamCard className="p-6 bg-gradient-to-br from-secondary/10 to-transparent border-secondary/20">
            <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Avg Recall Score</div>
            <div className="text-4xl font-bold text-white">{averageRecallScore}%</div>
            <Brain className="absolute right-4 bottom-4 w-10 h-10 text-white/5" />
          </DreamCard>

          <DreamCard className="p-6">
            <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Current Streak</div>
            <div className="text-4xl font-bold text-white">{mockAnalytics.current_streak}d</div>
            <Zap className="absolute right-4 bottom-4 w-10 h-10 text-white/5" />
          </DreamCard>

          <DreamCard className="p-6">
            <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Movies Ready</div>
            <div className="text-4xl font-bold text-white">{mockAnalytics.movie_generations}</div>
            <Video className="absolute right-4 bottom-4 w-10 h-10 text-white/5" />
          </DreamCard>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Analytics Area */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="lg:col-span-2 space-y-8"
        >
          {/* Recall Score Graph */}
          <motion.div variants={itemVariants}>
            <DreamCard className="p-8">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Recall Scores
                  </h3>
                  <p className="text-xs text-white/40 mt-1">Last 7 nights performance</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-[10px] text-white/60 font-bold uppercase tracking-wider">Score %</span>
                </div>
              </div>
              
              <div className="h-48 flex items-end justify-between gap-3 px-2">
                {mockAnalytics.dream_frequency.map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                    <div className="relative w-full flex flex-col items-center">
                       <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${day.count}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className="w-full bg-gradient-to-t from-primary/20 via-primary/60 to-primary rounded-t-xl transition-all duration-300 group-hover:brightness-125 group-hover:shadow-[0_0_15px_rgba(155,77,255,0.4)]"
                      />
                      <span className="absolute -top-6 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        {day.count}%
                      </span>
                    </div>
                    <span className="text-[10px] text-white/30 uppercase font-bold tracking-tighter">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            </DreamCard>
          </motion.div>

          {/* Quick Actions Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center justify-center p-4 rounded-[32px] bg-white/5 border border-white/5 hover:bg-primary/10 hover:border-primary/20 transition-all group aspect-square">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs font-bold text-white">Capture</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 rounded-[32px] bg-white/5 border border-white/5 hover:bg-secondary/10 hover:border-secondary/20 transition-all group aspect-square">
              <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <History className="w-6 h-6 text-secondary" />
              </div>
              <span className="text-xs font-bold text-white">Timeline</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 rounded-[32px] bg-white/5 border border-white/5 hover:bg-indigo-500/10 hover:border-indigo-500/20 transition-all group aspect-square">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6 text-indigo-400" />
              </div>
              <span className="text-xs font-bold text-white">Universe</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 rounded-[32px] bg-white/5 border border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all group aspect-square">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="text-xs font-bold text-white">Stats</span>
            </button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Mood Tracker */}
             <motion.div variants={itemVariants}>
              <DreamCard className="p-6 h-full">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Smile className="w-5 h-5 text-yellow-400" />
                  Mood Tracker
                </h3>
                <div className="space-y-5">
                  {mockAnalytics.top_emotions.map((emotion, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                        <span className="text-white/60">{emotion.name}</span>
                        <span className="text-white/40">{emotion.count} Dreams</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(emotion.count / 12) * 100}%` }}
                          transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                          className="h-full bg-gradient-to-r from-primary/50 to-primary rounded-full shadow-[0_0_10px_rgba(155,77,255,0.3)]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </DreamCard>
            </motion.div>

            {/* Symbol Cloud */}
            <motion.div variants={itemVariants}>
              <DreamCard className="p-6 h-full">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Ghost className="w-5 h-5 text-indigo-400" />
                  Symbol Cloud
                </h3>
                <div className="flex flex-wrap gap-2">
                  {mockAnalytics.top_symbols.map((symbol, i) => (
                    <button 
                      key={i} 
                      className={cn(
                        "px-4 py-2 rounded-2xl bg-white/5 border border-white/5 text-white/70 text-sm hover:border-primary/30 hover:bg-primary/5 transition-all",
                        i === 0 && "text-lg px-6 py-3 bg-primary/5 border-primary/20 text-white font-bold"
                      )}
                    >
                      {symbol.name}
                    </button>
                  ))}
                  {['Stars', 'Mirror', 'Doorway', 'Storm'].map((s, i) => (
                    <button key={i+10} className="px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/5 text-white/40 text-xs hover:text-white transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              </DreamCard>
            </motion.div>
          </div>
        </motion.div>

        {/* Sidebar: Recent Dreams (Last 5) */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-6"
        >
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xl font-bold text-white">Recent Rituals</h3>
            <button className="text-primary text-xs font-bold uppercase tracking-widest hover:underline">View All</button>
          </div>
          
          <div className="space-y-4">
            {recentDreams.map((dream, i) => (
              <motion.div key={dream.id} variants={itemVariants}>
                <DreamCard className="p-4 hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition-transform group">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-sm group-hover:text-primary transition-colors">{dream.title}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-white/40 font-bold uppercase tracking-tighter">
                        <span>{dream.date}</span>
                        <span>•</span>
                        <span className="text-primary/60">{dream.emotion}</span>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <div className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                        dream.completeness > 90 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-white/5 border-white/10 text-white/60"
                      )}>
                        {dream.completeness}%
                      </div>
                      {dream.hasMovie && (
                        <Video className="w-3.5 h-3.5 text-primary animate-pulse" />
                      )}
                    </div>
                  </div>
                </DreamCard>
              </motion.div>
            ))}
          </div>

          <motion.div variants={itemVariants}>
            <DreamCard className="p-6 bg-gradient-to-br from-primary/10 to-indigo-500/10 border-primary/20">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-primary/20 rounded-[24px] flex items-center justify-center mb-4 rotate-3 group-hover:rotate-0 transition-transform">
                  <Sparkles className="w-7 h-7 text-primary" />
                </div>
                <h4 className="text-white font-bold mb-2">Morning Ritual</h4>
                <p className="text-white/60 text-xs mb-6 leading-relaxed">
                  You haven't recorded a dream today. Capture it now before the details fade.
                </p>
                <DreamButton className="w-full h-12 text-sm font-bold">Start Capture</DreamButton>
              </div>
            </DreamCard>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
