import { populateDatabase } from '@/app/lib/faker';
import { NextRequest, NextResponse } from 'next/server';

// Endpoint 'api/populateDatabase' for populating MongoDB with 20,000 fake users data
export async function POST(_req: NextRequest, _res: NextResponse) {
  try {
    await populateDatabase(20000);
    return NextResponse.json(
      { message: 'Database populated successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
