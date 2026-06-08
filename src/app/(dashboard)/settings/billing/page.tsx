"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Moon,
  Check,
  X,
  Sparkles,
  Film,
  Infinity,
  BarChart3,
  BookOpen,
  Layers,
  RefreshCw,
  Star,
  Zap,
  Shield,
} from "lucide-react";
import { DreamButton } from "@/components/ui/DreamButton";
import { DreamCard } from "@/components/ui/DreamCard";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Start exploring your dreams",
    features: [
      { text: "Dream journal (text + voice)", included: true },
      { text: "Basic AI dream reconstruction", included: true },
      { text: "3 dream movies per month", included: true },
      { text: "Standard definition video", included: true },
      { text: "Basic dream interpretation", included: true },
      { text: "Dream Universe map", included: false },
      { text: "Alternate endings", included: false },
      { text: "HD video quality", included: false },
      { text: "Monthly analytics reports", included: false },
      { text: "Annual Dream Book (PDF)", included: false },
      { text: "Unlimited dream movies", included: false },
    ],
    cta: "Current Plan",
    variant: "outline" as const,
    highlighted: false,
  },
  {
    name: "Premium Monthly",
    price: "$14.99",
    period: "/month",
    description: "Unlock your full dream universe",
    features: [
      { text: "Dream journal (text + voice)", included: true },
      { text: "Advanced AI dream reconstruction", included: true },
      { text: "Unlimited dream movies", included: true },
      { text: "HD video quality", included: true },
      { text: "Advanced dream interpretation", included: true },
      { text: "Dream Universe map", included: true },
      { text: "Alternate endings with movies", included: true },
      { text: "Detailed analytics & patterns", included: true },
      { text: "Monthly analytics reports", included: true },
      { text: "Annual Dream Book (PDF)", included: true },
      { text: "Priority AI processing", included: true },
    ],
    cta: "Subscribe Monthly",
    variant: "gradient" as const,
    highlighted: true,
    priceId: "monthly", // placeholder — set actual Stripe price ID in env
  },
  {
    name: "Premium Yearly",
    price: "$99",
    period: "/year",
    description: "Best value — save 45%",
    savings: "Save $80/year",
    features: [
      { text: "Everything in Premium Monthly", included: true },
      { text: "2 months free", included: true },
      { text: "Annual Dream Book (PDF) included", included: true },
      { text: "Early access to new features", included: true },
      { text: "Priority support", included: true },
    ],
    cta: "Subscribe Yearly",
    variant: "gradient" as const,
    highlighted: true,
    priceId: "yearly",
  },
];

export default function BillingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<"free" | "monthly" | "yearly">("free");

  // In production, fetch the user's current subscription from /api/stripe/subscription
  useEffect(() => {
    async function fetchSubscription() {
      try {
        const res = await fetch("/api/dreams", {
          headers: {
            Authorization: `Bearer ${(window as any).__supabaseToken}`,
          },
        });
        // For now, default to free
      } catch {
        // Not authenticated or API not ready
      }
    }
    fetchSubscription();
  }, []);

  async function handleSubscribe(plan: string) {
    setLoading(plan);
    setError(null);

    try {
      // Get auth token
      const { data: { session } } = await (await import("@/lib/db/supabase-browser")).getSupabaseBrowser().auth.getSession();
      
      if (!session?.access_token) {
        setError("Please sign in first");
        setLoading(null);
        return;
      }

      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          plan,
          success_url: `${window.location.origin}/settings/billing?success=true`,
          cancel_url: `${window.location.origin}/settings/billing?canceled=true`,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Failed to create checkout session");
        setLoading(null);
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = data.data.url;
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-dream-mesh px-4 pt-24 pb-32">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-dream-gradient mb-4 shadow-[0_0_30px_rgba(155,77,255,0.3)]">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Choose your dream plan
          </h1>
          <p className="text-foreground/40 mt-3 max-w-md mx-auto">
            Start free and upgrade when you&apos;re ready to explore deeper into
            your dream universe.
          </p>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Plan Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Savings Badge */}
              {plan.savings && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <div className="px-4 py-1 rounded-full bg-dream-gradient text-white text-[10px] font-bold uppercase tracking-widest shadow-lg">
                    {plan.savings}
                  </div>
                </div>
              )}

              <DreamCard
                glow={plan.highlighted}
                className={`p-6 h-full flex flex-col ${
                  plan.highlighted
                    ? "border-primary/20 ring-1 ring-primary/10"
                    : ""
                }`}
                hoverEffect={false}
              >
                {/* Header */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-1">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-bold text-white">
                      {plan.price}
                    </span>
                    <span className="text-foreground/30 text-sm">
                      {plan.period}
                    </span>
                  </div>
                  <p className="text-foreground/40 text-xs">{plan.description}</p>
                </div>

                {/* Features */}
                <div className="flex-1 space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <div key={feature.text} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-foreground/20 mt-0.5 shrink-0" />
                      )}
                      <span
                        className={`text-sm ${
                          feature.included
                            ? "text-foreground/80"
                            : "text-foreground/20"
                        }`}
                      >
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <DreamButton
                  variant={plan.variant}
                  size="lg"
                  className="w-full"
                  disabled={
                    loading !== null ||
                    (plan.name === "Free" && currentPlan === "free")
                  }
                  onClick={() => {
                    if (plan.name !== "Free") {
                      handleSubscribe(plan.priceId || plan.name.toLowerCase().split(" ")[1]);
                    }
                  }}
                >
                  {loading === plan.priceId || loading === plan.name.toLowerCase().split(" ")[1] ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Redirecting...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {plan.cta}
                    </span>
                  )}
                </DreamButton>
              </DreamCard>
            </motion.div>
          ))}
        </div>

        {/* Feature Comparison Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <DreamCard className="p-8 max-w-2xl mx-auto" hoverEffect={false}>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Why go Premium?
            </h3>
            <div className="grid sm:grid-cols-2 gap-6 text-left">
              <div className="flex items-start gap-3">
                <Film className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-white">Unlimited Movies</p>
                  <p className="text-xs text-foreground/40">
                    Turn every dream into a cinematic experience
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Layers className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-white">Dream Universe</p>
                  <p className="text-xs text-foreground/40">
                    Map recurring characters, symbols, and locations
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BarChart3 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-white">Deep Analytics</p>
                  <p className="text-xs text-foreground/40">
                    Discover patterns across your dream timeline
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-white">Dream Book</p>
                  <p className="text-xs text-foreground/40">
                    Get a beautifully formatted annual dream book
                  </p>
                </div>
              </div>
            </div>
          </DreamCard>

          {/* Trust & Security */}
          <div className="mt-8 flex items-center justify-center gap-6 text-foreground/20 text-xs">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Secure payments via Stripe
            </span>
            <span className="flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" />
              Cancel anytime
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5" />
              14-day money-back guarantee
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}