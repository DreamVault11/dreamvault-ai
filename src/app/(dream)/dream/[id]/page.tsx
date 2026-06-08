"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  ArrowLeft, 
  Share2, 
  Download, 
  Heart,
  BookOpen,
  Brain,
  Layers,
  Repeat,
  Info,
  Calendar,
  Clock,
  Zap,
  ChevronRight,
  Play,
  Star,
  Quote,
  History
  } from "lucide-react";

import { DreamButton } from "@/components/ui/DreamButton";
import { DreamCard } from "@/components/ui/DreamCard";
import { DreamGradientText } from "@/components/ui/DreamGradientText";
import { MoviePlayer } from "@/components/dream/MoviePlayer";
import { cn } from "@/lib/utils";

// Mock Data
const mockDream = {
  id: "1",
  title: "The Neon Cathedral",
  date: "Oct 24, 2023",
  summary: "A journey through a glowing glass cathedral where time melts and butterflies lead the way.",
  story: "I found myself standing in the center of a vast cathedral. The walls were not stone, but intricate lattices of neon light and shifting glass. Every step I took on the dark, water-like floor sent ripples of starlight outward. From the vaulted ceiling, a massive silver clock began to soften and drip like liquid metal. As the silver pools hit the floor, they transformed into thousands of translucent blue butterflies that swirled around me in a luminous vortex. I felt a profound sense of peace as the silent guide gestured toward the altar of light.",
  completeness_score: 94,
  duration_estimate: "15 mins",
  emotions: ["Wonder", "Serenity", "Surreal"],
  symbols: ["Cathedral", "Neon", "Melting Clock", "Blue Butterflies"],
  characters: ["The Silent Guide"],
  locations: ["Neon Cathedral", "Starlit Sea"],
  interpretations: {
    psychological: "The cathedral represents your internal structure and belief systems. The neon lights suggest a modern or high-energy state of mind. Melting clocks often symbolize a feeling that time is fluid or that current deadlines are losing their rigid power over you.",
    symbolic: "Butterflies are classic symbols of transformation. The transition from rigid metal (clock) to living creatures (butterflies) suggests a breakthrough in how you process rigid concepts into organic growth.",
    archetypal: "This is a 'Temple' dream, a classic search for the sacred within the self. The 'Guide' figure suggests you are not alone in this transition."
  },
  alternate_endings: [
    { id: "1", type: "Continue", title: "Follow the Butterflies", description: "Follow the swarm through the glass walls into the starlit void beyond." },
    { id: "2", type: "Face Threat", title: "Stop the Melting", description: "Try to freeze the silver clock and preserve the cathedral's structure." },
    { id: "3", type: "Change Ending", title: "The Cathedral Collapses", description: "The glass shatters into music as the butterflies carry you upward." }
  ],
  movie: {
    style: "Cinematic",
    duration: "60s",
    status: "ready"
  }
};

const mockStoryboard = [
  {
    scene_number: 1,
    description: "I was standing in a vast cathedral made of neon lights and glass.",
    visual_prompt: "cathedral made of neon lights, glowing glass, ethereal atmosphere",
    duration_seconds: 5,
    camera_angle: "wide shot",
    mood: "Wonder"
  },
  {
    scene_number: 2,
    description: "The floor beneath me was a shallow pool of dark, starlit water.",
    visual_prompt: "floor as shallow pool of dark water, starlit reflection, neon cathedral background",
    duration_seconds: 4,
    camera_angle: "low angle",
    mood: "Calm"
  }
];

export default function DreamDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("story");
  
  const tabs = [
    { id: "story", label: "Story", icon: BookOpen },
    { id: "interpretation", label: "Analysis", icon: Brain },
    { id: "entities", label: "Universe", icon: Layers },
    { id: "endings", label: "Endings", icon: Repeat },
  ];

  return (
    <div className="min-h-screen bg-dream-mesh px-4 pt-24 pb-32">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Link 
              href="/timeline" 
              className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-wider">
                  <Calendar className="w-3 h-3" />
                  {mockDream.date}
                </span>
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white/40 uppercase tracking-wider">
                  <Clock className="w-3 h-3" />
                  {mockDream.duration_estimate}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                {mockDream.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white">
              <Download className="w-5 h-5" />
            </button>
            <DreamButton variant="primary">
              <Heart className="w-5 h-5 mr-2" />
              Favorite
            </DreamButton>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-10">
            {/* Movie Player Mini / Preview */}
            <DreamCard className="overflow-hidden border-none relative group aspect-video lg:aspect-[21/9]">
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
               <MoviePlayer 
                 dreamTitle={mockDream.title}
                 style={mockDream.movie.style as any}
                 storyboard={mockStoryboard as any}
               />
               <div className="absolute bottom-8 left-8 z-20 flex items-center gap-4">
                 <Link href={`/movie/${params.id}`}>
                   <DreamButton variant="gradient" size="sm">
                     <Play className="w-4 h-4 mr-2" />
                     Watch Cinema
                   </DreamButton>
                 </Link>
                 <span className="text-white/60 text-xs font-medium">
                   {mockDream.movie.style} Style • {mockDream.movie.duration}
                 </span>
               </div>
            </DreamCard>

            {/* Tabs Navigation */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/5 w-fit">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all",
                    activeTab === tab.id 
                      ? "bg-dream-gradient text-white shadow-lg" 
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="min-h-[400px]"
              >
                {activeTab === "story" && (
                  <div className="space-y-8">
                    <div className="space-y-4">
                       <h3 className="text-xl font-bold text-white flex items-center gap-2">
                         <Quote className="w-5 h-5 text-primary" />
                         Dream Summary
                       </h3>
                       <p className="text-lg text-white/60 leading-relaxed italic">
                         "{mockDream.summary}"
                       </p>
                    </div>
                    <div className="space-y-4">
                       <h3 className="text-xl font-bold text-white flex items-center gap-2">
                         <BookOpen className="w-5 h-5 text-primary" />
                         Full Narrative
                       </h3>
                       <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 text-white/80 leading-relaxed text-lg space-y-4">
                         {mockDream.story}
                       </div>
                    </div>
                  </div>
                )}

                {activeTab === "interpretation" && (
                  <InterpretationSection interpretations={mockDream.interpretations} />
                )}

                {activeTab === "entities" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DreamCard className="p-8 space-y-6">
                      <h4 className="text-lg font-bold text-white flex items-center gap-2">
                        <Layers className="w-5 h-5 text-indigo-400" />
                        Symbols & Characters
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {mockDream.symbols.concat(mockDream.characters).map(item => (
                          <span key={item} className="px-4 py-2 rounded-2xl bg-white/5 border border-white/5 text-white/60 text-sm font-medium hover:text-white hover:border-white/20 transition-colors cursor-default">
                            {item}
                          </span>
                        ))}
                      </div>
                    </DreamCard>
                    
                    <DreamCard className="p-8 space-y-6">
                      <h4 className="text-lg font-bold text-white flex items-center gap-2">
                        <Zap className="w-5 h-5 text-pink-400" />
                        Emotions & Sensory
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {mockDream.emotions.map(item => (
                          <span key={item} className="px-4 py-2 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400 text-sm font-medium">
                            {item}
                          </span>
                        ))}
                      </div>
                    </DreamCard>

                    <DreamCard className="p-8 md:col-span-2 space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-bold text-white flex items-center gap-2">
                           <Info className="w-5 h-5 text-primary" />
                           Universe Connections
                        </h4>
                        <Link href="/universe" className="text-primary text-sm font-bold hover:underline">
                          View Universe Map
                        </Link>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {mockDream.locations.map(loc => (
                          <div key={loc} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-colors">
                             <span className="text-white/60 font-medium group-hover:text-white">{loc}</span>
                             <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-primary" />
                          </div>
                        ))}
                      </div>
                    </DreamCard>
                  </div>
                )}

                {activeTab === "endings" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-2">
                       <h3 className="text-2xl font-bold text-white">Alternate <DreamGradientText>Paths</DreamGradientText></h3>
                       <DreamButton variant="outline" size="sm">
                         <Sparkles className="w-4 h-4 mr-2" />
                         Generate New Ending
                       </DreamButton>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {mockDream.alternate_endings.map((ending) => (
                        <DreamCard key={ending.id} className="p-6 group cursor-pointer hover:border-primary/50 transition-all relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                             <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
                               Preview Path
                             </div>
                           </div>
                           <div className="flex items-start gap-6">
                             <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                               <Repeat className="w-6 h-6 text-white/40 group-hover:text-primary" />
                             </div>
                             <div className="space-y-1">
                               <div className="flex items-center gap-3">
                                 <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{ending.title}</h4>
                                 <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{ending.type}</span>
                               </div>
                               <p className="text-white/40 text-sm leading-relaxed">
                                 {ending.description}
                               </p>
                             </div>
                           </div>
                        </DreamCard>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">
            {/* Recall Stats */}
            <DreamCard className="p-8 space-y-8">
               <div className="space-y-2">
                 <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest">Reconstruction Status</h4>
                 <div className="flex items-end justify-between">
                   <span className="text-4xl font-bold text-white">High Fidelity</span>
                   <span className="text-primary font-mono font-bold mb-1">Ready</span>
                 </div>
               </div>

               <div className="space-y-6 pt-6 border-t border-white/5">
                 <div className="space-y-3">
                   <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                     <span className="text-white/40">Recall Completeness</span>
                     <span className="text-white">{mockDream.completeness_score}%</span>
                   </div>
                   <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${mockDream.completeness_score}%` }}
                       className="h-full bg-dream-gradient"
                     />
                   </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                     <span className="text-[10px] font-bold text-white/20 uppercase">Story Beats</span>
                     <span className="text-xl font-bold text-white block">12</span>
                   </div>
                   <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                     <span className="text-[10px] font-bold text-white/20 uppercase">Recall Mode</span>
                     <span className="text-xl font-bold text-white block">Guided</span>
                   </div>
                 </div>
               </div>

               <DreamButton variant="outline" className="w-full h-14">
                 <History className="w-5 h-5 mr-2" />
                 Recall Conversation
               </DreamButton>
            </DreamCard>

            {/* Quick Actions */}
            <div className="space-y-4">
               <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Dream Utilities</h4>
               <DreamCard className="p-2 space-y-1">
                 <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors group text-left">
                   <div className="flex items-center gap-4">
                     <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                       <Zap className="w-5 h-5" />
                     </div>
                     <div>
                       <span className="text-sm font-bold text-white block">Dream Journal</span>
                       <span className="text-[10px] text-white/40 uppercase">Export to PDF</span>
                     </div>
                   </div>
                   <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white" />
                 </button>
                 <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors group text-left">
                   <div className="flex items-center gap-4">
                     <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400">
                       <Share2 className="w-5 h-5" />
                     </div>
                     <div>
                       <span className="text-sm font-bold text-white block">Share Movie</span>
                       <span className="text-[10px] text-white/40 uppercase">Public link</span>
                     </div>
                   </div>
                   <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white" />
                 </button>
               </DreamCard>
            </div>

            {/* Lucid/Nightmare Badges */}
            <div className="flex gap-4">
               <div className="flex-1 p-6 rounded-3xl bg-blue-500/10 border border-blue-500/20 text-center space-y-2">
                 <Sparkles className="w-6 h-6 text-blue-400 mx-auto" />
                 <span className="text-[10px] font-bold text-blue-400 uppercase block tracking-widest">Lucid Dream</span>
               </div>
               <div className="flex-1 p-6 rounded-3xl bg-white/5 border border-white/5 text-center space-y-2 opacity-20">
                 <Zap className="w-6 h-6 text-white/40 mx-auto" />
                 <span className="text-[10px] font-bold text-white/40 uppercase block tracking-widest">Nightmare</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Re-using History icon which I forgot to import correctly
function InterpretationSection({ interpretations }: { interpretations: any }) {
  const [activeSubTab, setActiveSubTab] = useState("psychological");
  
  return (
    <div className="space-y-6">
      <div className="flex gap-2 p-1 rounded-xl bg-white/5 border border-white/5 w-fit">
        {Object.keys(interpretations).map((key) => (
          <button
            key={key}
            onClick={() => setActiveSubTab(key)}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold transition-all capitalize",
              activeSubTab === key 
                ? "bg-white/10 text-white" 
                : "text-white/40 hover:text-white"
            )}
          >
            {key}
          </button>
        ))}
      </div>

      <DreamCard className="p-8 space-y-6 min-h-[300px] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Brain className="w-32 h-32 text-primary" />
        </div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-2xl font-bold text-white capitalize">
              {activeSubTab} Interpretation
            </h4>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(star => (
                <Star key={star} className="w-4 h-4 text-secondary fill-secondary" />
              ))}
            </div>
          </div>
          <p className="text-lg text-white/60 leading-relaxed max-w-3xl">
            {interpretations[activeSubTab]}
          </p>
          
          <div className="pt-6 flex flex-wrap gap-4">
             <div className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest">
               <Sparkles className="w-4 h-4 text-secondary" />
               AI Confidence: 98%
             </div>
             <div className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest">
               <Info className="w-4 h-4 text-primary" />
               Based on recurring patterns
             </div>
          </div>
        </div>
      </DreamCard>
    </div>
  );
}

// End of DreamDetailPage component
