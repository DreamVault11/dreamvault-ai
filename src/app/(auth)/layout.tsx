// Auth layout — shared gradient mesh background for all auth pages
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | DreamScape AI",
    default: "Sign In | DreamScape AI",
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-dream-mesh flex flex-col">
      {children}
    </div>
  );
}
