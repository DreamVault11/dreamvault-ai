"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Moon, Globe, Apple, Sparkles, ArrowRight, Shield } from "lucide-react";
import { DreamButton } from "@/components/ui/DreamButton";
import { DreamInput } from "@/components/ui/DreamInput";
import { DreamCard } from "@/components/ui/DreamCard";
import { getSupabaseBrowser } from "@/lib/db/supabase-browser";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const supabase = getSupabaseBrowser();

  async function handleEmailSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading("email");
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(null);
      return;
    }

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: displayName || email.split("@")[0],
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(null);
      return;
    }

    setSuccess(true);
    setLoading(null);
  }

  async function handleSocialSignup(provider: "google" | "apple") {
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

  if (success) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm text-center"
        >
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-dream-gradient mb-6 shadow-[0_0_40px_rgba(155,77,255,0.3)]">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Check your inbox
          </h2>
          <p className="text-foreground/40 text-sm mb-8 leading-relaxed">
            We sent a confirmation email to{" "}
            <span className="text-white/60">{email}</span>
            .<br />
            Click the link to activate your dream universe.
          </p>
          <Link href="/login">
            <DreamButton variant="outline" size="lg">
              Back to sign in
            </DreamButton>
          </Link>
        </motion.div>
      </div>
    );
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
            Begin your dream exploration journey
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

          {/* Signup Form */}
          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-foreground/40 uppercase tracking-widest mb-2">
                Display Name
              </label>
              <DreamInput
                type="text"
                placeholder="Your dreamer name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

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
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
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
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Create Account <ArrowRight className="w-4 h-4" />
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
              onClick={() => handleSocialSignup("google")}
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
                  <Globe className="w-5 h-5" />
                  Sign up with Google
                </span>
              )}
            </DreamButton>

            <DreamButton
              type="button"
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => handleSocialSignup("apple")}
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
                  Sign up with Apple
                </span>
              )}
            </DreamButton>
          </div>

          {/* Privacy Note */}
          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-xs text-foreground/20 text-center flex items-center justify-center gap-2">
              <Shield className="w-3 h-3" />
              Your dreams stay private and secure
            </p>
          </div>
        </DreamCard>

        {/* Login Link */}
        <p className="text-center mt-6 text-sm text-foreground/30">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:text-primary/80 transition-colors font-medium"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}