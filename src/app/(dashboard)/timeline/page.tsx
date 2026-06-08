"use client";

import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  Calendar as CalendarIcon, 
  LayoutList, 
  ChevronRight, 
  Sparkles,
  Clock,
  MapPin,
  Users,
  Smile,
  Video
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DreamCard } from "@/components/ui/DreamCard";
import { DreamInput } from "@/components/ui/DreamInput";
import { DreamButton } from "@/components/ui/DreamButton";
import { DreamGradientText } from "@/components/ui/DreamGradientText";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Mock Data
const mockDreams = [
  {
    id: "1",
    title: "The Neon Cathedral",
    date: "2023-10-26",
    emotion: "Wonder",
    location: "Neon City",
    characters: ["Stranger"],
    symbols: ["Clock", "Butterfly"],
    hasMovie: true,
    completeness: 94
  },
  {
    id: "2",
    title: "Running from Silence",
    date: "2023-10-25",
    emotion: "Anxiety",
    location: "Void",
    characters: ["Self"],
    symbols: ["Shadow"],
    hasMovie: false,
    completeness: 68
  },
  {
    id: "3",
    title: "The Underwater Library",
    date: "2023-10-24",
    emotion: "Calm",
    location: "Deep Ocean",
    characters: ["Librarian"],
    symbols: ["Book", "Whale"],
    hasMovie: true,
    completeness: 88
  },
  {
    id: "4",
    title: "Gravity Protocol",
    date: "2023-10-23",
    emotion: "Wonder",
    location: "Space Station",
    characters: ["Astra"],
    symbols: ["Star"],
    hasMovie: true,
    completeness: 91
  },
  {
    id: "5",
    title: "Forgotten Dialects",
    date: "2023-10-22",
    emotion: "Curiosity",
    location: "Ancient Ruins",
    characters: ["Scholar"],
    symbols: ["Stone"],
    hasMovie: false,
    completeness: 75
  }
];

export default function TimelinePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewViewMode] = useState<"list" | "calendar">("list");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filteredDreams = mockDreams.filter(dream => 
    dream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dream.emotion.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dream.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-dream-mesh px-4 pt-24 pb-32">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Dream <DreamGradientText>Timeline</DreamGradientText>
            </h1>
            <p className="text-white/40 mt-1">Navigate through your subconscious history.</p>
          </div>

          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
            <button 
              onClick={() => setViewViewMode("list")}
              className={cn(
                "p-2.5 rounded-xl transition-all flex items-center gap-2 text-sm font-bold",
                viewMode === "list" ? "bg-primary text-white" : "text-white/40 hover:text-white"
              )}
            >
              <LayoutList className="w-4 h-4" />
              List
            </button>
            <button 
              onClick={() => setViewViewMode("calendar")}
              className={cn(
                "p-2.5 rounded-xl transition-all flex items-center gap-2 text-sm font-bold",
                viewMode === "calendar" ? "bg-primary text-white" : "text-white/40 hover:text-white"
              )}
            >
              <CalendarIcon className="w-4 h-4" />
              Calendar
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search dreams, emotions, or locations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all"
            />
          </div>
          
          <div className="flex gap-2">
            {['Emotion', 'Location', 'Character', 'Symbol'].map((filter) => (
              <button 
                key={filter}
                onClick={() => setActiveFilter(activeFilter === filter ? null : filter)}
                className={cn(
                  "px-4 py-2 rounded-2xl border text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2",
                  activeFilter === filter 
                    ? "bg-primary/20 border-primary/50 text-white" 
                    : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
                )}
              >
                <Filter className="w-3.5 h-3.5" />
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* View Content */}
        <AnimatePresence mode="wait">
          {viewMode === "list" ? (
            <motion.div 
              key="list-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {filteredDreams.length > 0 ? (
                filteredDreams.map((dream, i) => (
                  <motion.div
                    key={dream.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link href={`/dream/${dream.id}`}>
                      <DreamCard className="p-6 group hover:scale-[1.01] active:scale-[0.99] transition-all flex flex-col md:flex-row md:items-center gap-6">
                        {/* Date Marker */}
                        <div className="flex flex-col items-center justify-center text-center px-4 py-2 rounded-2xl bg-white/5 border border-white/5 group-hover:border-primary/30 transition-colors shrink-0">
                          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">
                            {new Date(dream.date).toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                          <span className="text-2xl font-bold text-white leading-none">
                            {new Date(dream.date).getDate()}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                                {dream.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-4 mt-1">
                                <div className="flex items-center gap-1.5 text-xs text-white/40">
                                  <Smile className="w-3.5 h-3.5" />
                                  {dream.emotion}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-white/40">
                                  <MapPin className="w-3.5 h-3.5" />
                                  {dream.location}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-white/40">
                                  <Users className="w-3.5 h-3.5" />
                                  {dream.characters.join(", ")}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {dream.hasMovie && (
                                <div className="bg-primary/20 p-2 rounded-lg">
                                  <Video className="w-4 h-4 text-primary" />
                                </div>
                              )}
                              <div className={cn(
                                "text-[10px] font-bold px-3 py-1 rounded-full border",
                                dream.completeness > 90 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-white/5 border-white/10 text-white/60"
                              )}>
                                {dream.completeness}% Recall
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                             {dream.symbols.map(symbol => (
                               <span key={symbol} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold uppercase text-white/30">
                                 #{symbol}
                               </span>
                             ))}
                          </div>
                        </div>

                        <ChevronRight className="w-6 h-6 text-white/10 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                      </DreamCard>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="py-32 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <Search className="w-8 h-8 text-white/20" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white">No dreams found</h3>
                    <p className="text-white/40 max-w-xs mx-auto">Try adjusting your search or filters to explore your history.</p>
                  </div>
                  <DreamButton variant="outline" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </DreamButton>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="calendar-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="min-h-[500px] flex items-center justify-center border-2 border-dashed border-white/10 rounded-[40px]"
            >
              <div className="text-center space-y-4">
                <CalendarIcon className="w-12 h-12 text-primary mx-auto opacity-50" />
                <h3 className="text-xl font-bold text-white">Calendar View Coming Soon</h3>
                <p className="text-white/40 max-w-xs mx-auto text-sm">We're building an interactive way to visualize your sleep cycles and dream frequency.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
