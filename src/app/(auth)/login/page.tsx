"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Moon, Mail, Lock, Globe, Apple, Sparkles, ArrowRight } from "lucide-react";
import { DreamButton } from "@/components/ui/DreamButton";
import { DreamInput } from "@/components/ui/DreamInput";
import { DreamCard } from "@/components/ui/DreamCard";
import { getSupabaseBrowser } from "@/lib/db/supabase-browser";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const supabase = getSupabaseBrowser();

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading("email");
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(null);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function handleSocialLogin(provider: "google" | "apple") {
    setLoading(provider);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(null);
    }
  }

  async function handleMagicLink() {
    if (!email) {
      setError("Enter your email address first");
      return;
    }

    setLoading("magic");
    setError(null);

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(null);
      return;
    }

    setMagicLinkSent(true);
    setLoading(null);
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
            Welcome back to your dream universe
          </p>
        </div>

        <DreamCard glow className="p-6">
          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Magic Link Sent */}
          {magicLinkSent && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              Magic link sent! Check your inbox.
            </motion.div>
          )}

          {/* Email Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-foreground/40 uppercase tracking-widest mb-2">
                Email
              </label>
              <DreamInput
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground/40 uppercase tracking-widest mb-2">
                Password
              </label>
              <DreamInput
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs text-foreground/30 hover:text-primary transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <DreamButton
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full"
              disabled={loading !== null}
            >
              {loading === "email" ? (
                <span className="flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </DreamButton>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-xs text-foreground/20 bg-[#050505]">
                or continue with
              </span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="space-y-3">
            <DreamButton
              type="button"
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => handleSocialLogin("google")}
              disabled={loading !== null}
            >
              {loading === "google" ? (
                <span className="flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Connecting...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <Chrome className="w-5 h-5" />
                  Continue with Google
                </span>
              )}
            </DreamButton>

            <DreamButton
              type="button"
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => handleSocialLogin("apple")}
              disabled={loading !== null}
            >
              {loading === "apple" ? (
                <span className="flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Connecting...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <Apple className="w-5 h-5" />
                  Continue with Apple
                </span>
              )}
            </DreamButton>
          </div>

          {/* Magic Link */}
          <div className="mt-4 pt-4 border-t border-white/5">
            <DreamButton
              type="button"
              variant="ghost"
              size="sm"
              className="w-full text-foreground/40 hover:text-white"
              onClick={handleMagicLink}
              disabled={loading !== null}
            >
              {loading === "magic" ? (
                <span className="flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Sending magic link...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  Sign in with magic link
                </span>
              )}
            </DreamButton>
          </div>
        </DreamCard>

        {/* Sign Up Link */}
        <p className="text-center mt-6 text-sm text-foreground/30">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-primary hover:text-primary/80 transition-colors font-medium"
          >
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}