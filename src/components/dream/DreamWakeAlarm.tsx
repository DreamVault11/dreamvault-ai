"use client";

import React, { useState } from "react";
import { Clock, Bell, Volume2, VolumeX, Moon, Sun, Sparkles } from "lucide-react";
import { DreamButton } from "@/components/ui/DreamButton";
import { DreamCard } from "@/components/ui/DreamCard";
import { cn } from "@/lib/utils";

interface DreamWakeAlarmProps {
  onSetAlarm: (time: string, settings: any) => void;
}

export const DreamWakeAlarm: React.FC<DreamWakeAlarmProps> = ({ onSetAlarm }) => {
  const [time, setTime] = useState("07:00");
  const [isGentleWake, setIsGentleWake] = useState(true);
  const [sound, setSound] = useState("Cosmic Hum");
  const [isEnabled, setIsEnabled] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri"]);

  const sounds = ["Cosmic Hum", "Ocean Drift", "Rain Forest", "Tibetan Bowls"];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleToggle = () => {
    setIsEnabled(!isEnabled);
    if (!isEnabled) {
      onSetAlarm(time, { isGentleWake, sound });
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <DreamCard className="p-8 relative overflow-hidden" glow={isEnabled}>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Moon className="w-24 h-24" />
        </div>

        <div className="flex flex-col items-center space-y-8 relative z-10">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-white">DreamWake™</h3>
            <p className="text-foreground/40 text-sm">Smart alarm for better dream recall</p>
          </div>

          <div className="relative">
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-transparent text-6xl md:text-7xl font-bold text-white focus:outline-none focus:ring-0 cursor-pointer"
              style={{ colorScheme: "dark" }}
            />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-dream-gradient rounded-full" />
          </div>

          <div className="w-full space-y-6 pt-4">
            <div className="flex flex-col space-y-3">
               <span className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-1">Repeat</span>
               <div className="flex justify-between items-center bg-white/5 p-2 rounded-2xl border border-white/5">
                 {days.map((d) => (
                   <button
                     key={d}
                     onClick={() => toggleDay(d)}
                     className={cn(
                       "w-10 h-10 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center border",
                       selectedDays.includes(d)
                        ? "bg-primary text-white border-primary shadow-[0_0_10px_rgba(155,77,255,0.3)]" 
                        : "bg-transparent border-transparent text-foreground/40 hover:bg-white/5"
                     )}
                   >
                     {d.slice(0, 1)}
                   </button>
                 ))}
               </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-center space-x-3">
                <Sparkles className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-white">Gentle Wake</p>
                  <p className="text-xs text-foreground/40">Slowly increases volume</p>
                </div>
              </div>
              <button
                onClick={() => setIsGentleWake(!isGentleWake)}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  isGentleWake ? "bg-primary" : "bg-white/10"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                  isGentleWake ? "left-7" : "left-1"
                )} />
              </button>
            </div>

            <div className="flex flex-col space-y-3">
               <span className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-1">Wake Up Sound</span>
               <div className="flex flex-wrap gap-2">
                 {sounds.map((s) => (
                   <button
                     key={s}
                     onClick={() => setSound(s)}
                     className={cn(
                       "px-4 py-2 rounded-xl text-xs font-medium transition-all border",
                       sound === s 
                        ? "bg-primary/20 border-primary text-primary" 
                        : "bg-white/5 border-white/5 text-foreground/60 hover:bg-white/10"
                     )}
                   >
                     {s}
                   </button>
                 ))}
               </div>
            </div>
          </div>

          <DreamButton
            variant={isEnabled ? "outline" : "gradient"}
            className="w-full py-4 text-lg"
            onClick={handleToggle}
          >
            {isEnabled ? "Disable Alarm" : "Set Alarm"}
          </DreamButton>
        </div>
      </DreamCard>
      
      <div className="flex items-center space-x-4 p-4 rounded-3xl bg-blue-500/10 border border-blue-500/20">
        <Sun className="w-6 h-6 text-blue-400 shrink-0" />
        <p className="text-xs text-blue-200/80 leading-relaxed">
          DreamWake™ monitors your sleep cycles and wakes you during REM sleep to maximize your chances of remembering your dreams vividly.
        </p>
      </div>
    </div>
  );
};
