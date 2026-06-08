"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Clock, Trash2 } from "lucide-react";
import Link from "next/link";
import { DreamWakeAlarm } from "@/components/dream/DreamWakeAlarm";
import { DreamCard } from "@/components/ui/DreamCard";
import { cn } from "@/lib/utils";

interface Alarm {
  id: string;
  time: string;
  enabled: boolean;
  days: string[];
}

export default function AlarmPage() {
  const [alarms, setAlarms] = useState<Alarm[]>([
    { id: "1", time: "07:00", enabled: true, days: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
    { id: "2", time: "09:30", enabled: false, days: ["Sat", "Sun"] },
  ]);

  const toggleAlarm = (id: string) => {
    setAlarms(alarms.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const deleteAlarm = (id: string) => {
    setAlarms(alarms.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-dream-mesh px-4 pt-24 pb-32 overflow-y-auto">
      <div className="max-w-md mx-auto space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="p-2 rounded-full hover:bg-white/5 text-foreground/40 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold text-white uppercase tracking-widest">Alarms</h1>
          <button className="p-2 rounded-full bg-white/5 text-primary hover:bg-white/10 transition-colors">
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* DreamWake Section */}
        <div className="space-y-4">
           <h2 className="text-sm font-bold uppercase tracking-widest text-foreground/40 px-2">Setup Smart Alarm</h2>
           <DreamWakeAlarm onSetAlarm={(time, settings) => console.log("New alarm:", time, settings)} />
        </div>

        {/* Existing Alarms */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-foreground/40 px-2">Your Alarms</h2>
          <div className="space-y-3">
            {alarms.map((alarm) => (
              <DreamCard key={alarm.id} className="p-6" hoverEffect={false}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={cn(
                      "p-3 rounded-2xl transition-colors",
                      alarm.enabled ? "bg-primary/20 text-primary" : "bg-white/5 text-foreground/20"
                    )}>
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <span className={cn(
                        "text-3xl font-bold transition-colors",
                        alarm.enabled ? "text-white" : "text-foreground/40"
                      )}>
                        {alarm.time}
                      </span>
                      <p className="text-xs text-foreground/30 mt-1">
                        {alarm.days.join(", ")}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => deleteAlarm(alarm.id)}
                      className="p-2 text-foreground/20 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => toggleAlarm(alarm.id)}
                      className={cn(
                        "w-12 h-6 rounded-full transition-colors relative",
                        alarm.enabled ? "bg-primary" : "bg-white/10"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                        alarm.enabled ? "left-7" : "left-1"
                      )} />
                    </button>
                  </div>
                </div>
              </DreamCard>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
           <p className="text-xs text-foreground/40 italic">
             "Dream Capture will launch automatically after your alarm."
           </p>
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
