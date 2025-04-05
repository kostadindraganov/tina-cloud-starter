import { client } from "@/tina/__generated__/client";
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await client.queries.slidersConnection();
    
    if (!response || !response.data) {
      throw new Error("No data returned from Tina CMS");
    }
    
    const edges = response.data.slidersConnection?.edges || [];
    
    // Extract sliders from response
    const sliders = edges.map(edge => edge?.node).filter(Boolean);
    
    return NextResponse.json({ sliders });
  } catch (error) {
    console.error('Error fetching sliders:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error fetching sliders" },
      { status: 500 }
    );
  }
} 