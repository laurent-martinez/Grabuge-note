import { NextResponse } from 'next/server';
import { saveMenu } from '@/lib/kv';

export async function POST(request: Request) {
  try {
    const menuItems = await request.json();
    
    console.log('🔧 Sauvegarde du menu:', menuItems.length, 'items');
    
    await saveMenu(menuItems);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Error saving menu:', error);
    return NextResponse.json(
      { error: 'Failed to save menu' },
      { status: 500 }
    );
  }
}