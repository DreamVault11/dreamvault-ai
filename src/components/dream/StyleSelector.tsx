"use client";

import React from "react";
import { motion } from "framer-motion";
import { MovieStyle } from "@/types/dream";
import { cn } from "@/lib/utils";
import { 
  Film, 
  Sparkles, 
  Ghost, 
  Zap, 
  Wind, 
  Palette, 
  Eye
} from "lucide-react";

interface StyleOption {
  id: MovieStyle;
  name: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
}

const styles: StyleOption[] = [
  { 
    id: 'cinematic', 
    name: 'Cinematic', 
    description: 'Ultra-wide, filmic grain, dramatic lighting', 
    icon: Film,
    gradient: 'from-blue-600 to-indigo-900'
  },
  { 
    id: 'fantasy', 
    name: 'Fantasy', 
    description: 'Ethereal glows, vibrant magic, dreamlike colors', 
    icon: Sparkles,
    gradient: 'from-purple-500 to-pink-600'
  },
  { 
    id: 'surreal', 
    name: 'Surreal', 
    description: 'Impossible geometry, melting forms, Dali-esque', 
    icon: Eye,
    gradient: 'from-orange-400 to-red-600'
  },
  { 
    id: 'horror', 
    name: 'Horror', 
    description: 'Deep shadows, monochromatic, haunting visuals', 
    icon: Ghost,
    gradient: 'from-gray-800 to-black'
  },
  { 
    id: 'sci-fi', 
    name: 'Sci-Fi', 
    description: 'Neon glows, futuristic tech, cosmic scale', 
    icon: Zap,
    gradient: 'from-cyan-400 to-blue-600'
  },
  { 
    id: 'animated', 
    name: 'Animated', 
    description: 'Hand-drawn feel, expressive characters, soft textures', 
    icon: Palette,
    gradient: 'from-pink-400 to-orange-400'
  },
  { 
    id: 'realistic', 
    name: 'Realistic', 
    description: 'Hyper-detailed, natural light, everyday textures', 
    icon: Wind,
    gradient: 'from-emerald-400 to-teal-600'
  },
];

interface StyleSelectorProps {
  selectedStyle: MovieStyle;
  onStyleSelect: (style: MovieStyle) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onStyleSelect }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
      {styles.map((style) => {
        const isSelected = selectedStyle === style.id;
        return (
          <button
            key={style.id}
            onClick={() => onStyleSelect(style.id)}
            className={cn(
              "relative group p-4 rounded-3xl border transition-all duration-300 text-left overflow-hidden",
              isSelected 
                ? "bg-white/10 border-white/20 shadow-xl" 
                : "bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10"
            )}
          >
            {/* Hover Background Gradient */}
            <div className={cn(
              "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br",
              style.gradient
            )} />

            {/* Icon */}
            <div className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-500",
              isSelected ? "bg-white/10 scale-110" : "bg-white/5 group-hover:scale-110"
            )}>
              <style.icon className={cn(
                "w-5 h-5",
                isSelected ? "text-primary" : "text-white/40 group-hover:text-white"
              )} />
            </div>

            {/* Text */}
            <div className="space-y-1">
              <h4 className={cn(
                "text-xs font-bold uppercase tracking-widest",
                isSelected ? "text-white" : "text-white/40 group-hover:text-white"
              )}>
                {style.name}
              </h4>
              <p className="text-[10px] text-white/20 group-hover:text-white/40 leading-tight">
                {style.description}
              </p>
            </div>

            {/* Selection Indicator */}
            {isSelected && (
              <motion.div 
                layoutId="style-indicator"
                className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary"
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
