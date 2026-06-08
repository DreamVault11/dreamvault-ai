"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Moon, Mail, ArrowLeft, Sparkles, Send } from "lucide-react";
import { DreamButton } from "@/components/ui/DreamButton";
import { DreamInput } from "@/components/ui/DreamInput";
import { DreamCard } from "@/components/ui/DreamCard";
import { getSupabaseBrowser } from "@/lib/db/supabase-browser";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const supabase = getSupabaseBrowser();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {/* Branding */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-dream-gradient mb-4 shadow-[0_0_30px_rgba(155,77,255,0.3)]">
            <Moon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            DreamScape <span className="text-dream-gradient">AI</span>
          </h1>
          <p className="text-foreground/40 text-sm mt-2">
            Reset your access to the dream universe
          </p>
        </div>

        <DreamCard glow className="p-6">
          {sent ? (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-green-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">Reset link sent!</h2>
                <p className="text-sm text-foreground/40 leading-relaxed">
                  We've sent a password reset link to <span className="text-white/60">{email}</span>.
                </p>
              </div>
              <Link href="/login" className="block">
                <DreamButton variant="outline" className="w-full">
                  Back to login
                </DreamButton>
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-xs text-foreground/40 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Back to login
                </Link>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-foreground/40 uppercase tracking-widest">
                    Email Address
                  </label>
                  <DreamInput
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <p className="text-[10px] text-foreground/20 leading-relaxed">
                    We'll send you a link to reset your password securely.
                  </p>
                </div>

                <DreamButton
                  type="submit"
                  variant="gradient"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Send Reset Link <Send className="w-4 h-4" />
                    </span>
                  )}
                </DreamButton>
              </form>
            </>
          )}
        </DreamCard>
      </motion.div>
    </div>
  );
}
