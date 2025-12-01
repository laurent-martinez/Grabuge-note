import { NextRequest, NextResponse } from 'next/server';
import { saveNotes } from '@/lib/kv';

export async function POST(request: NextRequest) {
  try {
    const notes = await request.json();
    const success = await saveNotes(notes);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to save notes' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error updating notes:', error);
    return NextResponse.json({ error: 'Failed to update notes' }, { status: 500 });
  }
}
