# Zuzia Portfolio

A multilingual portfolio built with Next.js, React, Tailwind CSS, Framer Motion, and Resend.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Resend

## Requirements

Before starting, make sure you have:

- Node.js 20 or newer
- pnpm

## Installation

1. Clone the repository and move into the project folder.

```bash
git clone <your-repo-url>
cd Portfolio
```

2. Install dependencies.

```bash
pnpm install
```

3. Create a local environment file.

```bash
cp .env.example .env.local
```

If you are on Windows PowerShell, use:

```powershell
Copy-Item .env.example .env.local
```

4. Update the environment values inside `.env.local`.

```env
RESEND_API_KEY=your_resend_api_key
CONTACT_TO_EMAIL=your_email@example.com
CONTACT_FROM_EMAIL=Portfolio Contact <onboarding@resend.dev>
```

5. Start the development server.

```bash
pnpm dev
```

The site will be available at [http://localhost:3000](http://localhost:3000).

## Environment Variables

The contact form uses Resend.

- `RESEND_API_KEY`: Your Resend API key
- `CONTACT_TO_EMAIL`: The inbox that should receive contact form messages
- `CONTACT_FROM_EMAIL`: The sender shown in outgoing emails

### Resend Test Mode

If you are using Resend in test mode:

- `CONTACT_TO_EMAIL` must be your own Resend account email
- `CONTACT_FROM_EMAIL` should use `onboarding@resend.dev`

To send emails to any other recipient, verify a domain in Resend and then change `CONTACT_FROM_EMAIL` to an address using that verified domain.

## Available Scripts

```bash
pnpm dev
```

Runs the app in development mode with Turbopack.

```bash
pnpm build
```

Creates a production build.

```bash
pnpm start
```

Starts the production server after building.

```bash
pnpm lint
```

Runs ESLint.

## Project Structure

```text
app/          App Router pages and API routes
components/   Reusable UI and page sections
lib/          Theme and i18n context
hooks/        Shared React hooks
public/       Static assets
```

## Notes

- The website includes a global language system for the UI.
- The GitHub projects section fetches repositories separately.
- The blog page is currently in a temporary "coming soon" state.

## Production

For production deployment:

1. Set the environment variables on your hosting provider
2. Run `pnpm build`
3. Run `pnpm start` or deploy to a platform such as Vercel

## Troubleshooting

If the contact form does not send emails:

- Check that your Resend API key is valid
- Make sure the `from` and `to` addresses follow Resend rules
- In test mode, send only to your own Resend account email
- If sending to a custom inbox, verify your domain first

