import { client } from "@/tina/__generated__/client";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  if (!id) {
    return NextResponse.json(
      { error: "Slider ID is required" },
      { status: 400 }
    );
  }
  
  try {
    const response = await client.queries.sliders({
      relativePath: `${id}.mdx`,
    });
    
    if (!response || !response.data) {
      throw new Error("Slider not found");
    }
    
    return NextResponse.json({ slider: response.data.sliders });
  } catch (error) {
    console.error(`Error fetching slider with ID ${id}:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error fetching slider" },
      { status: 500 }
    );
  }
} 