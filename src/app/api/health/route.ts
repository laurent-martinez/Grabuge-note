import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Vérifier si REDIS_URL est définie
    const redisConfigured = !!process.env.REDIS_URL;

    if (!redisConfigured) {
      return NextResponse.json({
        status: 'warning',
        message: 'Redis non configuré. L\'application utilise les données par défaut.',
        configured: false,
        environment: process.env.NODE_ENV,
        note: 'Ceci est normal en développement local. En production sur Vercel, Redis doit être configuré.',
      });
    }

    // Tester la connexion Redis
    const { createClient } = await import('redis');
    const client = createClient({ url: process.env.REDIS_URL });
    
    await client.connect();
    await client.ping();
    await client.quit();

    return NextResponse.json({
      status: 'success',
      message: 'Redis est configuré et fonctionne correctement ! ✅',
      configured: true,
      environment: process.env.NODE_ENV,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: 'Erreur lors de la connexion à Redis',
      error: error.message,
      configured: false,
      note: 'Vérifiez que Redis est bien créé et que REDIS_URL est définie.',
    }, { status: 500 });
  }
}