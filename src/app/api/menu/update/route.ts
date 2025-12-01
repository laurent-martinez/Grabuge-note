import { NextRequest, NextResponse } from 'next/server';
import { saveMenu } from '@/lib/kv';

export async function POST(request: NextRequest) {
  try {
    const menuItems = await request.json();
    const success = await saveMenu(menuItems);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to save menu' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error updating menu:', error);
    return NextResponse.json({ error: 'Failed to update menu' }, { status: 500 });
  }
}
