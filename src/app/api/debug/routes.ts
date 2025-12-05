import { NextResponse } from 'next/server';
import { getNotes, getMenu } from '@/lib/kv';

export async function GET() {
  try {
    const notes = await getNotes();
    const menu = await getMenu();
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        notes: {
          count: notes.length,
          items: notes
        },
        menu: {
          count: menu.length,
          items: menu
        }
      }
    });
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 });
  }
}