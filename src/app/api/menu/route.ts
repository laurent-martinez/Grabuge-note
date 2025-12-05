import { NextResponse } from 'next/server';
import { getMenu } from '@/lib/kv';
import { initialMenuItems } from '@/data/menuItems';

export const dynamic = 'force-dynamic'; 
export const revalidate = 0;            

export async function GET() {
  try {
    const menu = await getMenu();
    
    // Si le menu est vide, initialiser avec les données par défaut
    if (!menu || (Array.isArray(menu) && menu.length === 0)) {
      const { saveMenu } = await import('@/lib/kv');
      await saveMenu(initialMenuItems);
      return NextResponse.json(initialMenuItems);
    }
    
    return NextResponse.json(menu);
  } catch (error) {
    console.error('Error reading menu:', error);
    // En cas d'erreur, retourner le menu par défaut
    return NextResponse.json(initialMenuItems);
  }
}
