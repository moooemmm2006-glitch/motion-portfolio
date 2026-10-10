import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { contactSchema } from '@/lib/contact-schema';

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Invalid form data', issues: parsed.error.flatten() }, { status: 422 });
  }
  const { name, email, projectType, budget, message, company } = parsed.data;
  if (company) return NextResponse.json({ ok: true }); // bot

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[contact] RESEND_API_KEY not set, message not sent:', parsed.data);
      return NextResponse.json({ ok: true, simulated: true });
    }
    return NextResponse.json({ ok: false, error: 'Email is not configured' }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL ?? 'Portfolio <onboarding@resend.dev>',
    to,
    replyTo: email,
    subject: `New ${projectType} inquiry from ${name}`,
    html: `<h2>New project inquiry</h2>
      <p><b>Name:</b> ${escape(name)}<br/><b>Email:</b> ${escape(email)}<br/>
      <b>Type:</b> ${escape(projectType)}<br/><b>Budget:</b> ${escape(budget)}</p>
      <p>${escape(message).replace(/\n/g, '<br/>')}</p>`,
  });

  if (error) return NextResponse.json({ ok: false, error: 'Send failed' }, { status: 502 });
  return NextResponse.json({ ok: true });
}
