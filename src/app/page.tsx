"use client";

import { motion } from "framer-motion";
import { 
  Sparkles, 
  Play, 
  Moon, 
  Brain, 
  Film, 
  ChevronRight,
  ArrowRight,
  History,
  Zap,
  Star
} from "lucide-react";
import Link from "next/link";
import { DreamButton } from "@/components/ui/DreamButton";
import { DreamCard } from "@/components/ui/DreamCard";
import { DreamGradientText } from "@/components/ui/DreamGradientText";

const features = [
  {
    title: "Dream Reconstruction",
    description: "Our AI engine analyzes your dream narratives to generate stunning cinematic movies that bring your subconscious to life.",
    icon: Film,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Guided Recall",
    description: "Personalized AI recall sessions use psychological prompts to help you remember vivid details you might have otherwise forgotten.",
    icon: Brain,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Dream Universe",
    description: "Map recurring characters, locations, and symbols across your timeline to discover deeper patterns in your dreaming life.",
    icon: Moon,
    color: "from-amber-500 to-orange-500",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 px-4">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 stars-overlay" />
          <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[140px] animate-pulse delay-700" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(155,77,255,0.05)_0%,transparent_70%)]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm font-medium text-white/80 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span>AI-Powered Dream Cinema</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-8xl font-bold tracking-tight mb-8"
          >
            Watch your dreams <br />
            <DreamGradientText>after you wake up.</DreamGradientText>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-2xl text-foreground/60 max-w-2xl mx-auto mb-12 font-light leading-relaxed"
          >
            The first platform that transforms your forgotten dreams into cinematic AI movies and explores the patterns of your subconscious.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/capture">
              <DreamButton size="lg" className="group">
                Start Dreaming
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </DreamButton>
            </Link>
            <Link href="/universe">
              <DreamButton variant="outline" size="lg">
                <Play className="w-5 h-5 mr-2 fill-white" />
                Explore
              </DreamButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Beyond just a journal.</h2>
            <p className="text-foreground/40 max-w-xl mx-auto">
              DreamScape AI uses advanced generative models to visualize what your mind creates while you sleep.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <DreamCard className="p-8 h-full" glow>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg transition-transform group-hover:scale-110`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-foreground/50 leading-relaxed">
                    {feature.description}
                  </p>
                </DreamCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent to-primary/5">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-bold text-dream-gradient mb-2">1M+</div>
            <div className="text-foreground/40 text-sm uppercase tracking-widest">Dreams Captured</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold text-dream-gradient mb-2">500k</div>
            <div className="text-foreground/40 text-sm uppercase tracking-widest">Movies Generated</div>
          </div>
          <div>
             <div className="text-4xl md:text-5xl font-bold text-dream-gradient mb-2">98%</div>
            <div className="text-foreground/40 text-sm uppercase tracking-widest">Recall Accuracy</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold text-dream-gradient mb-2">24/7</div>
            <div className="text-foreground/40 text-sm uppercase tracking-widest">Dream Support</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-secondary/20 rounded-full blur-[160px]" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 italic">"The dream is the small hidden door in the deepest and most intimate sanctum of the soul."</h2>
          <p className="text-foreground/60 mb-12">— Carl Jung</p>
          <Link href="/signup">
            <DreamButton variant="gradient" size="lg" className="px-10 py-6 text-xl">
              Create Your Universe
            </DreamButton>
          </Link>
        </div>
      </section>
    </div>
  );
}
