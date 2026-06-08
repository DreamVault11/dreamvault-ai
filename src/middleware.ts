// DreamScape AI — Next.js Middleware
// Handles CORS, request logging, rate limiting, auth redirects, and security headers
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ── Configuration ─────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  'https://dreamscape-ai.vercel.app',
];

const PUBLIC_PATHS = [
  '/api/health',
  '/api/auth/callback',
  '/api/stripe/webhook',
  '/login',
  '/signup',
  '/forgot-password',
  '/_next/static',
  '/_next/image',
  '/favicon.ico',
];

// Rate limiting config
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = {
  default: 100,        // general: 100 req/min
  '/api/auth': 10,     // auth endpoints: 10 req/min
  '/api/dreams': 30,   // dream endpoints: 30 req/min
  '/api/stripe': 20,   // stripe endpoints: 20 req/min
};

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// ── In-Memory Rate Limiter ────────────────────────────────────
// Note: Resets on server restart. For production, use Redis or Vercel KV.
const rateLimitStore = new Map<string, RateLimitEntry>();

function getRateLimitKey(ip: string, path: string): string {
  // Group by path prefix for tiered rate limiting
  for (const [prefix] of Object.entries(RATE_LIMIT_MAX_REQUESTS)) {
    if (prefix !== 'default' && path.startsWith(prefix)) {
      return `${ip}:${prefix}`;
    }
  }
  return `${ip}:default`;
}

function getRateLimitMax(path: string): number {
  for (const [prefix, max] of Object.entries(RATE_LIMIT_MAX_REQUESTS)) {
    if (prefix !== 'default' && path.startsWith(prefix)) {
      return max;
    }
  }
  return RATE_LIMIT_MAX_REQUESTS.default;
}

function checkRateLimit(ip: string, path: string): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const key = getRateLimitKey(ip, path);
  const now = Date.now();
  const maxRequests = getRateLimitMax(path);
  const entry = rateLimitStore.get(key);

  if (!entry || now >= entry.resetAt) {
    // New window
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + RATE_LIMIT_WINDOW_MS };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { allowed: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt };
}

// Cleanup old entries periodically (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now >= entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60_000);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const start = Date.now();
  const requestId = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  // ── Skip middleware for static files ─────────────────────────
  if (pathname.startsWith('/_next/static') || pathname.startsWith('/_next/image')) {
    return NextResponse.next();
  }

  // ── CORS Preflight Handling ─────────────────────────────────
  const origin = request.headers.get('origin') || '';
  const isAllowedOrigin = ALLOWED_ORIGINS.includes(origin) || origin.includes('localhost');

  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 });
    if (isAllowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    }
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Request-Id');
    response.headers.set('Access-Control-Max-Age', '86400');
    return response;
  }

  // ── Request Logging ─────────────────────────────────────────
  const isPublic = PUBLIC_PATHS.some(p => pathname.startsWith(p));
  const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
    || request.headers.get('x-real-ip') 
    || '127.0.0.1';

  if (!isPublic) {
    console.log(`[${requestId}] ➡ ${request.method} ${pathname} [${clientIp}]`);
  }

  // ── Rate Limiting (API routes only) ─────────────────────────
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/health')) {
    const { allowed, remaining, resetAt } = checkRateLimit(clientIp, pathname);

    if (!allowed) {
      const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);
      console.warn(`[${requestId}] ⛔ Rate limited: ${clientIp} on ${pathname}`);

      return new NextResponse(
        JSON.stringify({
          success: false,
          error: 'Too many requests. Please slow down.',
          retryAfter,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(retryAfter),
            'X-RateLimit-Limit': String(getRateLimitMax(pathname)),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(resetAt / 1000)),
            'Access-Control-Allow-Origin': isAllowedOrigin ? origin : '',
          },
        }
      );
    }

    // Add rate limit headers to all API responses
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', String(getRateLimitMax(pathname)));
    response.headers.set('X-RateLimit-Remaining', String(remaining));
    response.headers.set('X-RateLimit-Reset', String(Math.ceil(resetAt / 1000)));
  }

  // ── Auth Redirect (non-API page routes) ─────────────────────
  if (!pathname.startsWith('/api/') && !isPublic) {
    // Protected pages check — redirect to login if not authenticated
    // Auth check is done client-side; middleware just passes through
    // (Full auth check requires verifying JWT which is handled by API routes)
  }

  // ── Create Response with Security Headers ───────────────────
  const response = NextResponse.next();
  response.headers.set('X-Request-Id', requestId);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  // ── Request Completion Logging ──────────────────────────────
  const duration = Date.now() - start;
  if (!isPublic) {
    console.log(`[${requestId}] ✅ ${request.method} ${pathname} — ${duration}ms`);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.webp).*)',
  ],
};