import type { DemandSignal } from './types'

/**
 * The post-signup moment: exactly one welcome email per new waitlist join,
 * sent through Resend's REST API (no new dependencies — same pattern as
 * store.ts). Non-fatal by design: a Resend outage must never cost the
 * already-stored signal, and the address is never logged.
 *
 * Copy rules (same doctrine as the site, AGENTS.md): no price, no date, no
 * seat count, no countdown while the product is UNGATED. Founding framing
 * and the public syllabus link are allowed — they are true today.
 *
 * Env (Frank's gate — Vercel settings):
 *   RESEND_FROM      verified Resend sender, e.g. "AI Architect Academy <crew@…>"
 *                    unset ⇒ no email is sent (silent skip, like audience sync)
 *   RESEND_REPLY_TO  where replies land; defaults to the From address
 */

const SITE_URL = 'https://aiarchitectacademy.com'

const firstName = (name: string | undefined) => {
  const first = name?.trim().split(/\s+/)[0]
  return first && /^[A-Za-z][A-Za-z'’-]{0,39}$/.test(first) ? first : undefined
}

export interface WelcomeEmailPayload {
  from: string
  to: string
  subject: string
  html: string
  text: string
  reply_to?: string
}

/** Pure: builds the email payload. No env, no network — trivially testable. */
export function buildWelcomeEmail(signal: DemandSignal): WelcomeEmailPayload {
  const greeting = firstName(signal.name) ? `Hi ${firstName(signal.name)},` : 'Hello,'
  const subject = 'You’re on the list — AI Architect Academy'

  const text = [
    greeting,
    '',
    'You’re on the AI Architect Academy waitlist. Thanks for joining.',
    '',
    'What happens next:',
    '- The curriculum is shaped by what the founding list asks for. If you answered the',
    '  two-step questions, your answers already count toward module order.',
    '- Cohort 1 gets first access. There is no date yet — the cohort is scheduled when',
    '  the founding list fills, and you’ll hear it from this address first.',
    '- The syllabus is public, no signup needed to read it:',
    `  ${SITE_URL}`,
    '',
    'One favor: reply to this email with the one thing you’d want Cohort 1 to cover.',
    'A human reads every reply.',
    '',
    '— Frank',
    'AI Architect Academy',
    '',
    `You joined from ${signal.source}. Unsubscribe by replying “unsubscribe”.`,
  ].join('\n')

  const html = `<!doctype html>
<html><body style="margin:0;padding:24px;background:#0b0d12;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;">
<div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:12px;padding:32px;color:#14161c;line-height:1.6;">
<p style="margin:0 0 16px;font-size:16px;">${greeting}</p>
<p style="margin:0 0 16px;font-size:16px;">You’re on the <strong>AI Architect Academy</strong> waitlist. Thanks for joining.</p>
<p style="margin:0 0 8px;font-size:16px;"><strong>What happens next:</strong></p>
<ul style="margin:0 0 16px;padding-left:20px;font-size:16px;">
<li>The curriculum is shaped by what the founding list asks for. If you answered the two-step questions, your answers already count toward module order.</li>
<li>Cohort 1 gets first access. There is no date yet — the cohort is scheduled when the founding list fills, and you’ll hear it from this address first.</li>
<li>The syllabus is public, no signup needed to read it: <a href="${SITE_URL}" style="color:#14161c;">${SITE_URL}</a></li>
</ul>
<p style="margin:0 0 16px;font-size:16px;">One favor: reply to this email with the one thing you’d want Cohort 1 to cover. A human reads every reply.</p>
<p style="margin:0;font-size:16px;">— Frank<br/><span style="color:#6b7280;">AI Architect Academy</span></p>
<p style="margin:24px 0 0;font-size:13px;color:#6b7280;">You joined from ${signal.source}. Unsubscribe by replying “unsubscribe”.</p>
</div>
</body></html>`

  return { from: '', to: signal.email, subject, html, text }
}

/** Sends the welcome email. Returns true when an email was actually sent. */
export async function sendWelcomeEmail(signal: DemandSignal): Promise<boolean> {
  const from = process.env.RESEND_FROM
  if (!from || !process.env.RESEND_API_KEY) return false
  const payload = buildWelcomeEmail(signal)
  const body = {
    from,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
    reply_to: process.env.RESEND_REPLY_TO || from,
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return res.ok
  } catch {
    // Non-fatal: the signal is stored; a missed welcome email costs little.
    return false
  }
}
