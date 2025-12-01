import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Vérifier si les variables d'environnement KV sont définies
    const kvConfigured = !!(
      process.env.KV_REST_API_URL && 
      process.env.KV_REST_API_TOKEN
    );

    if (!kvConfigured) {
      return NextResponse.json({
        status: 'warning',
        message: 'Vercel KV non configuré. L\'application utilise les données par défaut.',
        configured: false,
        environment: process.env.NODE_ENV,
        note: 'Ceci est normal en développement local. En production sur Vercel, créez une base KV.',
      });
    }

    // Tester la connexion KV
    const { kv } = await import('@vercel/kv');
    await kv.ping();

    return NextResponse.json({
      status: 'success',
      message: 'Vercel KV est configuré et fonctionne correctement ! ✅',
      configured: true,
      environment: process.env.NODE_ENV,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: 'Erreur lors de la connexion à Vercel KV',
      error: error.message,
      configured: false,
      note: 'Vérifiez que Vercel KV est bien créé et connecté à votre projet.',
    }, { status: 500 });
  }
}
