"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Bell, 
  Clock, 
  Shield, 
  CreditCard, 
  History, 
  Check, 
  Sparkles,
  ChevronRight,
  LogOut,
  Mail,
  Camera,
  Moon,
  Zap,
  Volume2,
  Lock,
  Globe,
  Trash2,
  ExternalLink,
  Crown
} from "lucide-react";
import { DreamCard } from "@/components/ui/DreamCard";
import { DreamButton } from "@/components/ui/DreamButton";
import { DreamInput } from "@/components/ui/DreamInput";
import { DreamGradientText } from "@/components/ui/DreamGradientText";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState("Alex Dreamer");
  const [isSaving, setIsSaving] = useState(false);
  const [isPremium, setIsPremium] = useState(true); // Toggle for demo purposes

  // Profile Section
  const profileSection = (
    <DreamCard className="p-8 space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-1 rounded-2xl bg-dream-gradient">
          <div className="w-16 h-16 rounded-xl bg-black flex items-center justify-center relative group cursor-pointer">
            <User className="w-8 h-8 text-white/40" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
              <Camera className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white">Profile Identity</h3>
          <p className="text-xs text-white/40">How you appear in the dream universe.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-1">Display Name</label>
          <DreamInput 
            value={displayName} 
            onChange={(e) => setDisplayName(e.target.value)}
            className="bg-white/5 border-white/10"
          />
        </div>
        <div className="space-y-2 opacity-60">
          <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-1">Email Address</label>
          <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-white/40 text-sm flex items-center gap-2">
            <Mail className="w-4 h-4" />
            alex.dreamer@example.com
          </div>
        </div>
      </div>

      <DreamButton 
        variant="primary" 
        className="w-full"
        onClick={() => {
          setIsSaving(true);
          setTimeout(() => setIsSaving(false), 1500);
        }}
      >
        {isSaving ? "Syncing Identity..." : "Save Changes"}
      </DreamButton>
    </DreamCard>
  );

  // Notifications Section
  const notificationSection = (
    <DreamCard className="p-8 space-y-6">
      <div className="flex items-center gap-3">
        <Bell className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-bold text-white">Dream Signals</h3>
      </div>
      
      <div className="space-y-4">
        {[
          { id: "morning", label: "Morning Recall Reminder", desc: "Gentle nudge to record dreams upon waking." },
          { id: "weekly", label: "Weekly Subconscious Report", desc: "Digest of your weekly patterns and themes." },
          { id: "monthly", label: "Monthly Neural Summary", desc: "In-depth AI analysis of your dream month." },
          { id: "streak", label: "Dream Streak Alerts", desc: "Notify when your recording streak is at risk." },
        ].map((item) => (
          <div key={item.id} className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <div className="text-sm font-bold text-white">{item.label}</div>
              <div className="text-[10px] text-white/40">{item.desc}</div>
            </div>
            <div className="w-12 h-6 rounded-full bg-white/5 border border-white/10 relative p-1 cursor-pointer group">
              <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_10px_rgba(155,77,255,0.5)] translate-x-6" />
            </div>
          </div>
        ))}
      </div>
    </DreamCard>
  );

  // Alarm Defaults
  const alarmSection = (
    <DreamCard className="p-8 space-y-6">
      <div className="flex items-center gap-3">
        <Clock className="w-6 h-6 text-secondary" />
        <h3 className="text-xl font-bold text-white">DreamWake™ Defaults</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
          <label className="text-[10px] font-bold text-white/20 uppercase">Default Time</label>
          <div className="text-2xl font-bold text-white">07:30 AM</div>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
          <label className="text-[10px] font-bold text-white/20 uppercase">Alarm Sound</label>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white">Ethereal Forest</span>
            <Volume2 className="w-4 h-4 text-white/40" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between py-2">
        <div className="space-y-0.5">
          <div className="text-sm font-bold text-white">Gentle Wake Default</div>
          <div className="text-[10px] text-white/40">Start with 10 mins of ambient soundscape.</div>
        </div>
        <div className="w-12 h-6 rounded-full bg-white/10 border border-white/10 relative p-1 cursor-pointer">
          <div className="w-4 h-4 rounded-full bg-secondary translate-x-6" />
        </div>
      </div>
    </DreamCard>
  );

  // Billing Section
  const billingSection = (
    <div className="space-y-8">
      {/* Demo Toggle */}
      <div className="flex items-center justify-end gap-2 mb-4">
        <span className="text-[10px] text-white/20 uppercase font-bold">Demo Mode:</span>
        <button 
          onClick={() => setIsPremium(!isPremium)}
          className={cn(
            "px-3 py-1 rounded-full text-[10px] font-bold uppercase border transition-all",
            isPremium ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-white/10 text-white/40"
          )}
        >
          {isPremium ? "Premium View" : "Free View"}
        </button>
      </div>

      {isPremium ? (
        <DreamCard glow className="p-8 space-y-8 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                 <Crown className="w-5 h-5 text-primary" />
                 <span className="text-sm font-bold text-primary uppercase tracking-[0.2em]">Premium Member</span>
              </div>
              <h3 className="text-3xl font-bold text-white">DreamScape <DreamGradientText>Pro</DreamGradientText></h3>
            </div>
            <div className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase">
               Active
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-sm text-white/60">Your next renewal is on <span className="text-white font-bold">Nov 12, 2023</span>.</div>
            <div className="grid grid-cols-2 gap-3">
               <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-[10px] font-bold text-white/20 uppercase mb-1">Plan</div>
                  <div className="text-lg font-bold text-white">$14.99/mo</div>
               </div>
               <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-[10px] font-bold text-white/20 uppercase mb-1">Usage</div>
                  <div className="text-lg font-bold text-white">Unlimited</div>
               </div>
            </div>
          </div>

          <div className="pt-4 flex gap-4">
             <DreamButton variant="outline" className="flex-1">Manage Plan</DreamButton>
             <DreamButton variant="ghost" className="flex-1 text-white/40 hover:text-white">Cancel</DreamButton>
          </div>
        </DreamCard>
      ) : (
        <DreamCard className="p-8 space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
            <Sparkles className="w-24 h-24 text-primary" />
          </div>
          
          <div className="space-y-2 relative z-10">
            <h3 className="text-3xl font-bold text-white">Upgrade to <DreamGradientText>Pro</DreamGradientText></h3>
            <p className="text-white/40 text-sm">Unlock the full power of your subconscious.</p>
          </div>

          <div className="space-y-4 relative z-10">
            {[
              "Unlimited Dream Movies",
              "High Definition AI Reconstruction",
              "Full Dream Universe Exploration",
              "Monthly Pattern Analytics Reports",
              "Annual Physical Dream Book"
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm text-white/60">{feature}</span>
              </div>
            ))}
          </div>

          <DreamButton variant="gradient" className="w-full h-14 text-lg relative z-10">
            Unlock Premium — $14.99
          </DreamButton>
          
          <p className="text-center text-[10px] text-white/20 uppercase tracking-widest relative z-10">
            Save $80 with the <span className="text-primary font-bold">Yearly Plan</span>
          </p>
        </DreamCard>
      )}

      <div className="space-y-4">
         <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Payment Method</h4>
         <DreamCard className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-12 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white/40" />
               </div>
               <div>
                  <div className="text-sm font-bold text-white">Visa ending in 4242</div>
                  <div className="text-[10px] text-white/40">Expires 12/25</div>
               </div>
            </div>
            <button className="text-xs font-bold text-primary hover:underline">Update</button>
         </DreamCard>
      </div>

      <div className="space-y-4">
         <div className="flex items-center justify-between ml-1">
            <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest">Billing History</h4>
            <History className="w-4 h-4 text-white/20" />
         </div>
         <DreamCard className="overflow-hidden">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                     <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Date</th>
                     <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Amount</th>
                     <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest text-right">Invoice</th>
                  </tr>
               </thead>
               <tbody className="text-sm">
                  {[
                    { date: "Oct 12, 2023", amount: "$14.99" },
                    { date: "Sep 12, 2023", amount: "$14.99" },
                    { date: "Aug 12, 2023", amount: "$14.99" }
                  ].map((inv, i) => (
                    <tr key={i} className="border-b border-white/5 last:border-0">
                       <td className="px-6 py-4 text-white/60">{inv.date}</td>
                       <td className="px-6 py-4 text-white font-bold">{inv.amount}</td>
                       <td className="px-6 py-4 text-right">
                          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                             <ExternalLink className="w-4 h-4 text-white/20 hover:text-white" />
                          </button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </DreamCard>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dream-mesh px-4 pt-24 pb-32">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Universe <DreamGradientText>Control</DreamGradientText>
            </h1>
            <p className="text-white/40">Adjust your personal subconscious parameters.</p>
          </div>
          <div className="flex items-center gap-4">
             <DreamButton variant="outline" className="border-red-500/20 text-red-500/60 hover:bg-red-500/5">
                <Trash2 className="w-4 h-4 mr-2" />
                Purge Data
             </DreamButton>
             <DreamButton variant="ghost" className="text-white/40">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
             </DreamButton>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Settings Left Column */}
          <div className="lg:col-span-7 space-y-10">
            <section className="space-y-6">
               <div className="flex items-center gap-3 ml-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <h2 className="text-xs font-bold text-white uppercase tracking-[0.3em]">Identity</h2>
               </div>
               {profileSection}
            </section>

            <section className="space-y-6">
               <div className="flex items-center gap-3 ml-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  <h2 className="text-xs font-bold text-white uppercase tracking-[0.3em]">Environment</h2>
               </div>
               {alarmSection}
               {notificationSection}
            </section>

            <section className="space-y-6">
               <div className="flex items-center gap-3 ml-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <h2 className="text-xs font-bold text-white uppercase tracking-[0.3em]">Privacy & AI</h2>
               </div>
               <DreamCard className="p-8 space-y-6">
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <div className="text-sm font-bold text-white">Anonymous Data Contribution</div>
                      <div className="text-[10px] text-white/40">Help improve dream interpretations globally.</div>
                    </div>
                    <div className="w-12 h-6 rounded-full bg-white/10 border border-white/10 relative p-1 cursor-pointer">
                      <div className="w-4 h-4 rounded-full bg-indigo-500 translate-x-6" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2 border-t border-white/5 pt-6">
                    <div className="space-y-0.5">
                      <div className="text-sm font-bold text-white">AI Model Training</div>
                      <div className="text-[10px] text-white/40">Allow AI to learn from your specific dream vocabulary.</div>
                    </div>
                    <div className="w-12 h-6 rounded-full bg-white/5 border border-white/10 relative p-1 cursor-pointer">
                      <div className="w-4 h-4 rounded-full bg-white/20" />
                    </div>
                  </div>
               </DreamCard>
            </section>
          </div>

          {/* Billing Right Column */}
          <div className="lg:col-span-5 space-y-10">
            <section className="space-y-6">
               <div className="flex items-center gap-3 ml-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <h2 className="text-xs font-bold text-white uppercase tracking-[0.3em]">Subscription</h2>
               </div>
               {billingSection}
            </section>

            {/* Quick Links */}
            <section className="space-y-4">
               <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Resources</h4>
               <DreamCard className="p-2 space-y-1">
                 {[
                   { label: "Community Forum", icon: Globe },
                   { label: "Dream Science Docs", icon: BookOpen },
                   { label: "Security & Encryption", icon: Shield },
                   { label: "Contact Dream Support", icon: Mail },
                 ].map((link, i) => (
                   <button key={i} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors group text-left">
                     <div className="flex items-center gap-4">
                       <link.icon className="w-4 h-4 text-white/20 group-hover:text-primary" />
                       <span className="text-sm font-bold text-white">{link.label}</span>
                     </div>
                     <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-white" />
                   </button>
                 ))}
               </DreamCard>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
