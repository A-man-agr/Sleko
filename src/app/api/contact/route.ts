import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required fields.' },
        { status: 400 }
      );
    }

    // Email regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const ticketId = `SLK-TCK-${Math.floor(1000 + Math.random() * 9000)}`;

    return NextResponse.json({
      success: true,
      message: 'Thank you for reaching out to Slekco. Our support concierge will respond within 24 hours.',
      ticketId,
      data: { name, email, subject, message },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to process contact submission.' },
      { status: 500 }
    );
  }
}
