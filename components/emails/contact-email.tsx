import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface ContactEmailProps {
  name: string
  email: string
  subject?: string
  message: string
}

export function ContactEmail({ name, email, subject, message }: ContactEmailProps) {
  const mailtoHref = `mailto:${email}?subject=${encodeURIComponent(
    `Re: ${subject || `Portfolio message from ${name}`}`
  )}`

  return (
    <Html>
      <Head />
      <Preview>{name} sent a new portfolio message</Preview>
      <Body style={main}>
        <Section style={wrapper}>
          <Container style={container}>
            <Section style={hero}>
              <Text style={eyebrow}>Portfolio Contact</Text>
              <Heading style={heading}>New message from {name}</Heading>
              <Text style={paragraph}>
                A new message just arrived from your portfolio contact form. You can reply
                directly to this email to continue the conversation.
              </Text>
              <Link href={mailtoHref} style={cta}>
                Reply to {name}
              </Link>
            </Section>

            <Section style={content}>
              <Section style={card}>
                <Text style={label}>Name</Text>
                <Text style={value}>{name}</Text>
              </Section>

              <Section style={card}>
                <Text style={label}>Email</Text>
                <Link href={`mailto:${email}`} style={valueLink}>
                  {email}
                </Link>
              </Section>

              {subject ? (
                <Section style={card}>
                  <Text style={label}>Subject</Text>
                  <Text style={value}>{subject}</Text>
                </Section>
              ) : null}

              <Section style={messageCard}>
                <Text style={label}>Message</Text>
                <Text style={messageStyle}>{message}</Text>
              </Section>

              <Hr style={hr} />

              <Text style={replyHint}>
                Reply hint: your API already sets the sender as the reply-to address, so using
                your mail client&apos;s normal reply button will answer {name} directly.
              </Text>

              <Text style={footer}>
                Sent from the Zuziâ RodzeN portfolio contact form.
              </Text>
            </Section>
          </Container>
        </Section>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#08080d',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, "Helvetica Neue", Ubuntu, sans-serif',
  margin: '0',
  padding: '0',
}

const wrapper = {
  width: '100%',
  backgroundColor: '#08080d',
  padding: '32px 12px',
}

const container = {
  backgroundColor: '#111118',
  margin: '0 auto',
  padding: '0',
  borderRadius: '24px',
  border: '1px solid rgba(139, 92, 246, 0.22)',
  overflow: 'hidden',
  maxWidth: '620px',
  boxShadow: '0 18px 50px rgba(0, 0, 0, 0.4)',
}

const hero = {
  padding: '36px 32px 30px',
  background:
    'linear-gradient(135deg, rgba(139, 92, 246, 0.24) 0%, rgba(30, 58, 138, 0.16) 100%)',
  borderBottom: '1px solid rgba(139, 92, 246, 0.16)',
}

const eyebrow = {
  display: 'inline-block',
  color: '#d6c4ff',
  backgroundColor: 'rgba(17, 17, 24, 0.72)',
  border: '1px solid rgba(216, 180, 254, 0.2)',
  borderRadius: '999px',
  padding: '8px 14px',
  fontSize: '12px',
  fontWeight: '700',
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  margin: '0 0 18px',
}

const heading = {
  color: '#f5f3ff',
  fontSize: '32px',
  fontWeight: '700',
  lineHeight: '1.2',
  margin: '0 0 12px',
}

const paragraph = {
  color: '#d4d4dd',
  fontSize: '15px',
  lineHeight: '25px',
  margin: '0 0 22px',
}

const cta = {
  display: 'inline-block',
  background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
  color: '#ffffff',
  textDecoration: 'none',
  padding: '12px 18px',
  borderRadius: '14px',
  fontSize: '14px',
  fontWeight: '700',
}

const content = {
  padding: '28px',
}

const hr = {
  borderColor: 'rgba(139, 92, 246, 0.14)',
  margin: '24px 0',
}

const card = {
  margin: '0 0 14px',
  padding: '18px 20px',
  backgroundColor: '#161621',
  border: '1px solid rgba(139, 92, 246, 0.14)',
  borderRadius: '18px',
}

const label = {
  color: '#b691ff',
  fontSize: '11px',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
  margin: '0 0 8px',
}

const value = {
  color: '#f5f5f5',
  fontSize: '16px',
  margin: '0',
  lineHeight: '24px',
}

const valueLink = {
  color: '#8ec5ff',
  fontSize: '16px',
  textDecoration: 'none',
}

const messageCard = {
  margin: '0 0 10px',
  padding: '20px',
  backgroundColor: '#18122a',
  border: '1px solid rgba(139, 92, 246, 0.18)',
  borderLeft: '4px solid #8B5CF6',
  borderRadius: '18px',
}

const messageStyle = {
  color: '#f5f5f5',
  fontSize: '16px',
  lineHeight: '28px',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
}

const replyHint = {
  color: '#a1a1aa',
  fontSize: '13px',
  lineHeight: '22px',
  margin: '0 0 14px',
}

const footer = {
  color: '#77778a',
  fontSize: '12px',
  lineHeight: '20px',
  margin: '0',
}

export default ContactEmail
