import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { ContactEmail } from '@/components/emails/contact-email'

interface ContactRequestBody {
  name?: string
  email?: string
  subject?: string
  message?: string
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function normalizeField(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function extractEmailAddress(value: string) {
  const match = value.match(/<([^>]+)>/)
  return (match?.[1] || value).trim()
}

function getResendErrorMessage(message: string) {
  if (message.includes('You can only send testing emails to your own email address')) {
    return 'Resend test mode is active. Set CONTACT_TO_EMAIL to your own Resend account email and use onboarding@resend.dev as CONTACT_FROM_EMAIL. To send to other addresses, verify a domain on resend.com/domains first.'
  }

  return message || 'Failed to send email'
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactRequestBody
    const name = normalizeField(body.name)
    const email = normalizeField(body.email)
    const subject = normalizeField(body.subject)
    const message = normalizeField(body.message)

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    const resendApiKey = `re_9rf39qSw_7MDMvmd3FUzDv9KC2qacvRjP`
    const toEmail = "contact@zuzia.dev"
    const fromEmail = `Portfolio Contact <${toEmail}>`

    if (!resendApiKey || !toEmail || !fromEmail) {
      console.error('Contact form configuration is incomplete', {
        hasResendApiKey: Boolean(resendApiKey),
        hasContactToEmail: Boolean(toEmail),
        hasContactFromEmail: Boolean(fromEmail),
      })

      return NextResponse.json(
        {
          error:
            'Contact form is not configured yet. Add RESEND_API_KEY, CONTACT_TO_EMAIL, and CONTACT_FROM_EMAIL.',
        },
        { status: 503 }
      )
    }

    const resend = new Resend(resendApiKey)
    const toAddress = extractEmailAddress(toEmail)

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [toAddress],
      replyTo: email,
      subject: subject || `New Contact Message from ${name}`,
      react: ContactEmail({ name, email, subject, message }),
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: getResendErrorMessage(error.message || '') },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Email sent successfully', id: data?.id },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
