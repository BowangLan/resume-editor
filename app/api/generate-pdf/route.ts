import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { latex } = await request.json();

    if (!latex) {
      return NextResponse.json(
        { error: 'No LaTeX content provided' },
        { status: 400 }
      );
    }

    // Use LaTeX.Online API - reliable and free service
    // Endpoint: https://latexonline.cc/compile?text=<latex code>
    const encodedLatex = encodeURIComponent(latex);
    const compileUrl = `https://latexonline.cc/compile?text=${encodedLatex}`;

    const response = await fetch(compileUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Resume-Editor/1.0',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Compilation error:', errorText);
      throw new Error(`LaTeX compilation failed: ${response.statusText}`);
    }

    const pdfBuffer = await response.arrayBuffer();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume.pdf"',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
