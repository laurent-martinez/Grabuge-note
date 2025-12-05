import { NextResponse } from 'next/server';
import { getNotes } from '@/lib/kv';

export const dynamic = 'force-dynamic'; 
export const revalidate = 0;           

export async function GET() {
  try {
    const notes = await getNotes();
    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error reading notes:', error);
    return NextResponse.json([]);
  }
}
