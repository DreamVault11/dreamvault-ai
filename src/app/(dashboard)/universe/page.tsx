"use client";

import React, { useState } from "react";
import { 
  Compass, 
  Users, 
  MapPin, 
  Ghost, 
  ChevronRight, 
  Sparkles,
  Search,
  Filter,
  Network,
  Maximize2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DreamCard } from "@/components/ui/DreamCard";
import { DreamButton } from "@/components/ui/DreamButton";
import { DreamGradientText } from "@/components/ui/DreamGradientText";
import { cn } from "@/lib/utils";

// Mock Data
const recurringEntities = {
  characters: [
    { name: "The Stranger", count: 12, description: "A tall silhouette often appearing in urban settings.", role: "Guide" },
    { name: "Talking Cat", count: 5, description: "A ginger cat with cynical commentary on my life choices.", role: "Companion" },
    { name: "Old Friend", count: 8, description: "Manifestations of people from high school.", role: "Protagonist" },
  ],
  locations: [
    { name: "Neon City", count: 15, description: "A rain-slicked metropolis with endless skyscrapers.", type: "Urban" },
    { name: "Floating Island", count: 6, description: "A patch of jungle suspended in a purple sky.", type: "Surreal" },
    { name: "Deep Forest", count: 9, description: "An ancient woods where the trees whisper secrets.", type: "Nature" },
  ],
  symbols: [
    { name: "Ocean", count: 22, description: "Represents emotional depth and the unknown.", themes: ["Creativity", "Change"] },
    { name: "Clock", count: 14, description: "Time pressure and existential dread.", themes: ["Anxiety", "Control"] },
    { name: "Butterfly", count: 7, description: "Transformation and fragility.", themes: ["Hope", "Ethereal"] },
  ]
};

export default function UniversePage() {
  const [activeCategory, setActiveCategory] = useState<"characters" | "locations" | "symbols">("characters");
  const [selectedEntity, setSelectedEntity] = useState<any>(null);

  const getEntityRole = (entity: any) => {
    return entity.role || entity.type || (entity.themes && entity.themes.join(", ")) || "Primary";
  };

  return (
    <div className="min-h-screen bg-dream-mesh px-4 pt-24 pb-32">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Dream <DreamGradientText>Universe</DreamGradientText>
            </h1>
            <p className="text-white/40 mt-1">Explore recurring entities and their connections.</p>
          </div>

          <div className="flex items-center gap-3">
             <button className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white">
               <Network className="w-5 h-5" />
             </button>
             <DreamButton variant="primary">
               <Sparkles className="w-5 h-5 mr-2" />
               Entity Analytics
             </DreamButton>
          </div>
        </div>

        {/* Universe Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="space-y-4">
             <div className="bg-white/5 border border-white/10 rounded-[32px] p-2 flex flex-col gap-1">
                {[
                  { id: "characters", name: "Characters", icon: Users },
                  { id: "locations", name: "Locations", icon: MapPin },
                  { id: "symbols", name: "Symbols", icon: Ghost }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as any)}
                    className={cn(
                      "flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all",
                      activeCategory === cat.id ? "bg-primary text-white" : "text-white/40 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <cat.icon className="w-5 h-5" />
                    {cat.name}
                  </button>
                ))}
             </div>

             {/* Search Bar */}
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search entities..." 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all"
                />
             </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
             <AnimatePresence mode="wait">
               <motion.div 
                 key={activeCategory}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -20 }}
                 className="grid grid-cols-1 md:grid-cols-2 gap-4"
               >
                 {recurringEntities[activeCategory].map((entity, i) => (
                   <motion.div
                     key={entity.name}
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.05 }}
                   >
                     <DreamCard 
                       className={cn(
                         "p-6 group cursor-pointer hover:border-primary/30 transition-all",
                         selectedEntity?.name === entity.name && "border-primary/50 bg-primary/5"
                       )}
                       onClick={() => setSelectedEntity(entity)}
                     >
                       <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 group-hover:text-primary transition-colors">
                            {activeCategory === "characters" ? <Users className="w-6 h-6" /> : 
                             activeCategory === "locations" ? <MapPin className="w-6 h-6" /> : 
                             <Ghost className="w-6 h-6" />}
                          </div>
                          <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-white/40 uppercase">
                            {entity.count} Appearances
                          </div>
                       </div>
                       
                       <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                         {entity.name}
                       </h3>
                       <p className="text-xs text-white/40 leading-relaxed line-clamp-2">
                         {entity.description}
                       </p>
                       
                       <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                            {getEntityRole(entity)}
                          </span>
                          <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                       </div>
                     </DreamCard>
                   </motion.div>
                 ))}
               </motion.div>
             </AnimatePresence>

             {/* Relationship Map Placeholder */}
             <DreamCard className="p-8 h-96 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(155,77,255,0.05),transparent_70%)]" />
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center space-y-6">
                   <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                     <Network className="w-10 h-10 text-primary opacity-50" />
                   </div>
                   <div className="space-y-2">
                     <h3 className="text-2xl font-bold text-white">Neural Entity Map</h3>
                     <p className="text-white/40 max-w-sm mx-auto text-sm">Visualize how entities across different dreams interact and share storylines.</p>
                   </div>
                   <DreamButton variant="outline" size="sm">
                     <Maximize2 className="w-4 h-4 mr-2" />
                     Launch Explorer
                   </DreamButton>
                </div>

                {/* Animated Particles */}
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/40 rounded-full blur-[2px] animate-pulse" />
                <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-secondary/40 rounded-full blur-[2px] animate-pulse [animation-delay:1s]" />
                <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-indigo-500/40 rounded-full blur-[2px] animate-pulse [animation-delay:0.5s]" />
             </DreamCard>
          </div>
        </div>
      </div>

      {/* Entity Modal Overlay (Placeholder) */}
      <AnimatePresence>
        {selectedEntity && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-md"
            onClick={() => setSelectedEntity(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-2xl"
              onClick={e => e.stopPropagation()}
            >
              <DreamCard className="p-8 space-y-8 shadow-[0_0_100px_rgba(155,77,255,0.2)]">
                <div className="flex items-start justify-between">
                   <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-bold text-white">{selectedEntity.name}</h2>
                        <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase">
                          {activeCategory.slice(0, -1)}
                        </span>
                      </div>
                      <p className="text-white/60 leading-relaxed">
                        {selectedEntity.description}
                      </p>
                   </div>
                   <button 
                    onClick={() => setSelectedEntity(null)}
                    className="text-white/20 hover:text-white transition-colors p-2"
                   >
                     Close
                   </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-2">
                      <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest block">Occurrence</span>
                      <span className="text-2xl font-bold text-white">{selectedEntity.count} dreams</span>
                   </div>
                   <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-2">
                      <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest block">Role / Type</span>
                      <span className="text-2xl font-bold text-white">{getEntityRole(selectedEntity)}</span>
                   </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest">Recent Appearances</h4>
                  <div className="space-y-3">
                     {[
                       { title: "The Neon Cathedral", date: "2 days ago" },
                       { title: "Shattered Horizon", date: "Last week" }
                     ].map((dream, i) => (
                       <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                          <span className="font-bold text-white group-hover:text-primary transition-colors">{dream.title}</span>
                          <span className="text-xs text-white/20">{dream.date}</span>
                       </div>
                     ))}
                  </div>
                </div>

                <DreamButton variant="gradient" className="w-full h-14 text-lg">
                  Deep Entity Analysis
                </DreamButton>
              </DreamCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
