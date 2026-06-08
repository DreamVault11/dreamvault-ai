# DREAMSCAPE_ARCHITECTURE.md

## Overview
DreamScape AI is a Next.js application designed to transform dreams into cinematic AI movies. The architecture focuses on a mobile-first, premium user experience with a "dreamlike" design system.

## Tech Stack
- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **State Management:** React Context / Zustand (if needed)
- **Auth:** NextAuth.js or Supabase Auth (Integration pending)

## Directory Structure
- `src/app/`: Routes and page components.
  - `(auth)/`: Authentication pages (Login, Signup).
  - `(dashboard)/`: User dashboard and main app features (Timeline, Universe, Stats).
  - `(dream)/`: Dream capture, recall, and movie player flows.
  - `api/`: Backend API routes.
- `src/components/`: Reusable React components.
  - `ui/`: Fundamental UI components (Button, Input, Card).
  - `dream/`: Domain-specific components (MoviePlayer, RecallFlow, CaptureModal, DreamWakeAlarm, VoiceRecorder).
  - `layout/`: Layout-specific components (NavBar, AppSidebar, Footer).
  - `shared/`: Generic shared components.
- `src/lib/`: Shared utilities, hooks, and constants.
  - `hooks/`: Custom React hooks.
  - `utils.ts`: Utility functions (Tailwind merge, etc.).
- `src/types/`: Shared TypeScript interfaces.
- `public/`: Static assets (logo, placeholder videos, images).

## Key Features & Components
1. **Dream Capture:** A slide-up modal for quick dream entry via text or voice.
2. **Guided Recall:** A chat-like interface that prompts users for specific dream details.
3. **Dream Movie Player:** A custom video player with mood/style selectors.
4. **Dream Universe:** An interactive map or list of recurring dream elements.
5. **Dream Dashboard:** Statistics, streaks, recall scores, and activity trends.


## Design System
- **Default Mode:** Dark (Pure black/Midnight blue backgrounds).
- **Primary Colors:** Deep Purples, Midnight Blues, Cosmic Pinks (Gradients).
- **Typography:** Elegant sans-serif (Inter/Geist).
- **UX Principles:** Magical, Fluid, Emotional, Minimal.
- **Animations:** Subtle fade-ins, slide-ups, and smooth transitions using Framer Motion.

## Routing Plan
- `/`: Landing Page
- `/login`: Login Page
- `/signup`: Signup Page
- `/dashboard`: Main Dashboard
- `/timeline`: Chronological dream list
- `/capture`: Dream capture flow
- `/recall`: Guided recall session
- `/dream/:id`: Dream Detail View (Full info, interpretations, endings)
- `/movie/:id`: Dream movie player (Immersive cinema view)
- `/universe`: Dream Universe explorer
- `/settings`: User settings and billing control
