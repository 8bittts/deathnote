import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // In a real implementation, we would call the Firecrawl API here
    // For now, we'll simulate a response
    const extractedContent = `
# Content from ${url}

This is simulated content that would be extracted from the provided URL.

## Sample Article Title

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget magna auctor, 
feugiat nisl eget, ultricies nunc. Nulla facilisi. Sed euismod, nunc ac ultricies 
tincidunt, nisl nunc tincidunt nunc, eget aliquam nunc nunc eget magna.

### Important Points

- Point one about the article
- Point two about the article
- Point three about the article

Thank you for reading.
    `;

    return NextResponse.json({ content: extractedContent });
  } catch (error) {
    console.error("[FIRECRAWL_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
} 