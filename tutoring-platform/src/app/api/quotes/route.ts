import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch a random subset of up to 10 quotes
    // PostgreSQL RANDOM() is not natively supported by Prisma without raw queries.
    // For simplicity and compatibility, we'll fetch all and shuffle in memory 
    // (assuming the quote pool is not massive initially).
    
    const allQuotes = await prisma.quote.findMany();
    
    if (allQuotes.length === 0) {
      // If DB is empty, return an empty array (the client can handle fallback)
      return NextResponse.json({ success: true, quotes: [] });
    }

    // Shuffle and pick 10
    const shuffled = allQuotes.sort(() => 0.5 - Math.random());
    const selectedQuotes = shuffled.slice(0, 10);

    return NextResponse.json({ success: true, quotes: selectedQuotes });
  } catch (error: any) {
    console.error("Fetch Quotes Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
