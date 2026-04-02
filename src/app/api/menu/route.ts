import { NextResponse } from 'next/server';
import { getMenu, saveMenu } from '@/lib/kv';
import { initialMenuItems } from '@/data/menuItems';

export const dynamic = 'force-dynamic'; 
export const revalidate = 0;            

export async function GET() {
  try {
    const menu = await getMenu();
    
    console.log('📖 GET /api/menu - Menu récupéré:', menu ? menu.length : 0, 'items');
    
    // ⚠️ INITIALISER SEULEMENT SI LE MENU N'EXISTE PAS DU TOUT
    // (null ou undefined, PAS un tableau vide !)
    if (menu === null || menu === undefined) {
      console.log('🔧 Première initialisation du menu avec données par défaut');
      await saveMenu(initialMenuItems);
      return NextResponse.json(initialMenuItems);
    }
    
    // Si le menu existe (même vide), le retourner tel quel
    return NextResponse.json(menu);
  } catch (error) {
    console.error('❌ Error reading menu:', error);
    // En cas d'erreur, retourner le menu par défaut
    return NextResponse.json(initialMenuItems);
  }
}