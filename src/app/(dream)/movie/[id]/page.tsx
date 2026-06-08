"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  ArrowLeft, 
  Download, 
  Share2, 
  Heart,
  MessageSquare,
  History,
  Info
} from "lucide-react";
import Link from "next/link";
import { MoviePlayer } from "@/components/dream/MoviePlayer";
import { StyleSelector } from "@/components/dream/StyleSelector";
import { DreamButton } from "@/components/ui/DreamButton";
import { DreamCard } from "@/components/ui/DreamCard";
import { DreamGradientText } from "@/components/ui/DreamGradientText";
import { MovieStyle, StoryboardFrame } from "@/types/dream";

// Mock Data
const mockStoryboard: StoryboardFrame[] = [
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
  },
  {
    scene_number: 3,
    description: "A large, silver clock face began to melt from the ceiling.",
    visual_prompt: "melting silver clock face from neon ceiling, surrealism, dripping liquid metal",
    duration_seconds: 6,
    camera_angle: "close up",
    mood: "Surreal"
  },
  {
    scene_number: 4,
    description: "Thousands of blue butterflies emerged from the clock, filling the air.",
    visual_prompt: "thousands of glowing blue butterflies, cinematic lighting, swarm",
    duration_seconds: 5,
    camera_angle: "tracking shot",
    mood: "Magical"
  },
  {
    scene_number: 5,
    description: "Everything dissolved into a soft white light as I woke up.",
    visual_prompt: "dissolving neon cathedral, brilliant white light, transition to wakefulness",
    duration_seconds: 5,
    camera_angle: "fade to white",
    mood: "Peaceful"
  }
];

export default function MoviePage() {
  const params = useParams();
  const [style, setStyle] = useState<MovieStyle>("cinematic");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleStyleChange = (newStyle: MovieStyle) => {
    setStyle(newStyle);
    // Simulate generation when style changes
    setIsGenerating(true);
    setProgress(0);
  };

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsGenerating(false);
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  return (
    <div className="min-h-screen bg-dream-mesh px-4 pt-24 pb-32">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Link 
              href="/dashboard" 
              className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">AI Reconstruction</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                The Neon <DreamGradientText>Cathedral</DreamGradientText>
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
              <Heart className="w-5 h-5 mr-2 fill-current" />
              Save to Universe
            </DreamButton>
          </div>
        </div>

        {/* Player Section */}
        <div className="relative">
          <MoviePlayer 
            dreamTitle="The Neon Cathedral"
            style={style}
            storyboard={mockStoryboard}
          />
          
          {isGenerating && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl z-20 flex flex-col items-center justify-center rounded-[40px]">
              <div className="w-64 space-y-4 text-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-t-2 border-primary rounded-full mx-auto"
                />
                <h3 className="text-xl font-bold text-white">Regenerating Cinema</h3>
                <p className="text-white/40 text-sm">Applying {style} aesthetics to your subconscious memories...</p>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Style Selector Section */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white">Cinematic <DreamGradientText>Styles</DreamGradientText></h3>
            <p className="text-white/40 text-sm">Choose a lens for your dream reconstruction</p>
          </div>
          <StyleSelector 
            selectedStyle={style}
            onStyleSelect={handleStyleChange}
          />
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Analysis Card */}
          <DreamCard className="p-8 md:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-bold text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Dream Analysis
              </h4>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-white/40 uppercase block">Recall Score</span>
                  <span className="text-xl font-mono text-white">94%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <p className="text-white/70 leading-relaxed italic">
                "This dream explores themes of structure vs. fluid reality. The neon cathedral represents your desire for mental clarity, while the melting clock suggests a transition in how you perceive time and deadlines."
              </p>
              
              <div className="flex flex-wrap gap-2 pt-4">
                {['Surrealism', 'Architectural', 'Introspective', 'Vivid'].map(tag => (
                  <span key={tag} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-white/40 text-xs font-bold uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex items-center justify-between">
               <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-xs font-bold text-white/40">
                     P{i}
                   </div>
                 ))}
                 <div className="w-10 h-10 rounded-full border-2 border-black bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/40">
                   +12
                 </div>
               </div>
               <button className="text-primary text-sm font-bold flex items-center gap-2 hover:underline">
                 View Conversation <MessageSquare className="w-4 h-4" />
               </button>
            </div>
          </DreamCard>

          {/* Timeline / History Card */}
          <DreamCard className="p-8 space-y-8">
            <h4 className="text-xl font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-secondary" />
              Reconstruction History
            </h4>
            
            <div className="space-y-6">
              {[
                { style: 'Realistic', date: '2 hours ago', icon: 'R' },
                { style: 'Fantasy', date: 'Yesterday', icon: 'F' },
                { style: 'Cinematic', date: '2 days ago', icon: 'C' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 font-bold group-hover:bg-white/10 transition-all">
                    {item.icon}
                  </div>
                  <div className="flex-1 border-b border-white/5 pb-4">
                    <h5 className="font-bold text-white text-sm">{item.style} Version</h5>
                    <p className="text-xs text-white/40">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>

            <DreamButton variant="outline" className="w-full">
              Full History
            </DreamButton>
          </DreamCard>
        </div>
      </div>
    </div>
  );
}
