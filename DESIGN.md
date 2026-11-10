# Zuzia — design system: "The Pass"

Locked system for every page of zuzia.dev. Pages share this system; they do not rotate themes.

## Who and what

Zuziâ RodzeN lives in Turkey, trained at a tourism high school, works as a **cook**, and builds software and AI
(Neuroa, NoteAI, Mirai) as a hobby after service. The site is a personal portfolio (mode: **Experience**).
Visitors: other developers, Discord community members, people who found a project and want to know who made it.
One job per page: Home = who is this person; Skills = what they work with and how well; Projects = see and open
the work; Contact = send a message through the terminal; Blog = holding page.

## The world

A kitchen pass at night: brushed stainless steel, a gas flame (blue core, orange tip), paper order tickets on a rail.
The metaphor is carried by **material and object**, not by copy. Do not rename sections to kitchen puns; the nav still
says About / Skills / Projects / Blog / Contact.

- **Steel** — flat, cool, slightly blue neutral surfaces. Solid, never glass. Hairline seams between zones.
- **Flame** — the single colour pair. `--primary` (flame core) and `--heat` (flame tip). The only gradient in the
  system is the flame bar (`.flame`), used for gauges and progress, never for text and never as a background wash.
- **Tickets** — the signature object (`.ticket`): a perforated paper slip. Use it only where content is a discrete
  dated/ordered item (timeline events, a project's spec sheet, the contact receipt). Do not turn every card into a ticket.

## Tokens (app/globals.css)

Never write raw colour values or font-family names in components. Use Tailwind theme classes or the CSS variables.

| Role | Class / var | Notes |
| --- | --- | --- |
| Page | `bg-background` `text-foreground` | steel |
| Raised surface | `bg-card`, `.surface`, `.surface-lift` | 1px `border-border`, radius `rounded-lg` |
| Quiet fill / hover | `bg-secondary`, `bg-accent`, `bg-muted` | `--accent` is a neutral hover fill, NOT a brand colour |
| Secondary text | `text-muted-foreground` | passes 4.5:1 on background and card |
| Flame core | `text-primary` `bg-primary` `border-primary` | user-selectable via settings (9 pairs) |
| Flame tip | `text-heat` `bg-heat` | second colour of the pair; use sparingly, for the "hot" state |
| Flame bar | `.flame` | gauges, scroll progress, active indicators |
| Radius | `rounded-sm/md/lg/xl` = 4/6/10/16px | steel is machined: small radii. Pills only for `.chip` |
| Easing | `var(--ease-out)`, `EASE_OUT` from fx/motion | exponential ease-out. No bounce, no spring overshoot on UI state |

Light and dark are both first-class (`.dark` on `<html>`); verify both.

## Type

Three families, loaded in app/layout.tsx with latin, latin-ext and cyrillic subsets (the site ships ru/kk/ky).

- **Unbounded** (`font-display`) — headings only. Wide, heavy, set tight. Roman only, never italic.
  `.t-display` (hero name, max 6rem) · `.t-title` (page and section titles) · `.t-heading` (card/item titles).
- **Onest** (`font-sans`) — all running text and UI. `.t-lead` for intros. Body measure ≤ 68ch.
- **Martian Mono** (`font-mono`, `.t-data`) — ONLY for real data: dates, years, percentages, counts, versions,
  tech/stack names, repo names, terminal I/O. Never as decoration, never for ordinary labels.

Rules: sentence case everywhere. No ALL-CAPS labels. No eyebrow/kicker above headings. No gradient text. No single
accent-coloured word inside a heading. No section numbers unless the content is a real sequence (the timeline is).
No middle-dot meta strings, no "→" glued to link text (use a lucide icon that moves on hover instead).

## Layout

- `.shell` = max 80rem + fluid gutter. One container width site-wide.
- Left-aligned, asymmetric compositions. Centered text blocks only for genuinely short, single-statement moments.
- Sections are separated by space (`py-24 sm:py-32`) and, where zones change, a `.seam`. More space above a heading
  than below it.
- Cards are not the default container. Prefer rows, lists with hairlines, split layouts, and full-bleed strips.
  Never nest a card in a card. Never ship a grid of identical icon+title+text cards.
- Fixed nav height is `var(--nav-h)`; page content starts below it (`pt-[calc(var(--nav-h)+3rem)]`).
- Must be flawless at 320 / 375 / 768 / 1024 / 1440. No horizontal scroll. Touch targets ≥ 44px. Grid tracks holding
  images use `minmax(0,1fr)`.

## Motion (components/fx/motion.tsx)

Motion is authored per section; do not repeat one entrance down the page. Import from `@/components/fx/motion`:

| Primitive | Use |
| --- | --- |
| `<SplitText text by="word\|char" as="h2" trigger="view\|mount" />` | headings: words rise out of a mask |
| `<Reveal variant="rise\|wipe\|unblur\|slide" delay />` | a block entering view. Vary the variant by section |
| `<Tilt max glare>` | pointer 3D tilt for a featured object (project art, a ticket). Not on every card |
| `<Magnetic>` | wraps the one primary action in a view |
| `<CountUp value suffix />` | numbers that are real data |
| `<Gauge value label delay />` | the flame bar, fills on view. `role="meter"` built in |
| `<Marquee duration reverse>` | endless strip, pauses on hover |
| `<Parallax offset>` | decorative depth layers |
| `EASE_OUT` | the easing tuple for custom framer-motion transitions |

Scroll-linked work uses framer-motion `useScroll` + `useTransform` (Lenis smooth scroll is already mounted globally and
drives native scroll, so `useScroll` just works). Pinned sequences use a tall wrapper + `position: sticky` child.
Only animate `transform`, `opacity`, `clip-path`, `filter`. Every effect must fall back to a static, complete layout
under `prefers-reduced-motion` (`useReducedMotion()`), and pinned/horizontal sequences must fall back to a normal
vertical list on small screens.

Micro-interactions: 160–280ms, `var(--ease-out)`. Hover never shifts layout. Focus rings are instant, never animated.

## Components

- Buttons: `.btn .btn-primary` / `.btn .btn-ghost` (or shadcn `Button`, which reads the same tokens). One primary per view.
- Chips / filter toggles: `.chip`; pressed state via `aria-pressed="true"`.
- Text links: `.link-draw`.
- Icons: `lucide-react` for UI, `react-icons/si` for brand marks. One size per context. No emoji.
- Images: real project art from `/public` (`neuroa_banner.png`, `neuroa.png`, `noteai.png`, `mirai.png`). No fake
  browser chrome, no invented screenshots, no stock.

## Copy

All visible strings go through `useI18n().t(key)`. Existing keys live in `lib/i18n-context.tsx` (do not edit that
file). New strings go in the area file you own under `lib/i18n/` with **both `en` and `tr`**; other languages fall back
to English. Never invent facts, metrics, testimonials or client names. Keep the person's own words for bio/timeline.
Controls name their action ("Send message", "Open repository").

## Hard bans

Glassmorphism/backdrop blur as decoration · glow halos · gradient text · purple-on-black · floating blurred colour orbs ·
identical card grids · eyebrows · ALL CAPS · italic headings · emoji icons · raw hex in components · `transition: all`.
