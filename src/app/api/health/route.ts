// DreamScape AI — Health Check Endpoint
// Returns basic service status information
// Extended version with env var details available at /api/health/env

export async function GET() {
  const healthData = {
    status: 'ok',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  };

  return new Response(JSON.stringify(healthData, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}