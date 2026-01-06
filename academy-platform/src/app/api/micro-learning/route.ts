import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.resolve(process.cwd(), '..', 'docs', 'data', 'micro-learning.json');
    const content = await fs.readFile(filePath, 'utf-8');
    return NextResponse.json(JSON.parse(content));
  } catch (error) {
    console.error('Failed to read micro-learning dataset', error);
    return NextResponse.json({ modules: [] }, { status: 500 });
  }
}
