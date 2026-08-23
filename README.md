# Yasin — Premium Front-End Portfolio

A premium, dark-first React portfolio focused on frontend development, interface craft, responsive engineering, and purposeful motion.

## Stack

- React 19
- Vite
- Tailwind CSS v4
- Motion
- Lenis
- React Router

## Run locally

```bash
npm install
npm run dev
```

## Production verification

```bash
npm run lint
npm run build
npm run preview
```

The production build is the important final check. Do not deploy a project that has not passed `npm run build`.

## Contact form — production setup

The contact form sends an asynchronous JSON request to the Cloudflare Pages Function at `POST /api/contact`. The Function validates and normalizes every field, applies anti-abuse controls, and delivers the categorized message directly through the Telegram Bot API. Bot credentials never enter the browser bundle.

### 1. Configure Telegram and Cloudflare

Create a bot with BotFather, start a private conversation with it, and obtain the destination chat ID. In **Workers & Pages → project → Settings → Variables and Secrets**, configure:

- `TELEGRAM_BOT_TOKEN` as an encrypted secret.
- `TELEGRAM_CHAT_ID` as an encrypted secret.
- `CONTACT_ALLOWED_ORIGINS` as an exact comma-separated origin allowlist.
- Do **not** configure `TURNSTILE_SECRET_KEY` yet: the current client does not mount a Turnstile widget or send a token. Server support is reserved for a future client integration.
- A KV namespace bound as `CONTACT_RATE_LIMIT` for stronger best-effort rate limiting (optional but recommended).

Never prefix Telegram secrets with `VITE_`; Vite variables are public client configuration. For local Pages Function development, copy `.dev.vars.example` to the Git-ignored `.dev.vars`.

### 2. Public contact email

The only optional client environment value is:

```env
VITE_CONTACT_EMAIL=hello@yourdomain.com
```

Copy `.env.example` to `.env.local` when this public email shortcut is needed. `.env.local` is ignored by Git.

### 3. Deploy and verify

Deploy the project as a Cloudflare Pages site so the `functions/` directory is mounted beside the Vite build. Run:

```bash
npm run build
```

Then submit one real request from every production origin and verify success, validation errors, rate limiting, and Telegram delivery. Full environment, payload, future Turnstile integration, KV, and security instructions are in [`docs/contact-backend.md`](docs/contact-backend.md).

## Content before launch

The codebase is prepared for deployment, but a few personal/content placeholders must be replaced before public launch.

Before publishing, replace:

- `src/data/projects.js` — real project names, descriptions, screenshots, stack, GitHub and live links.
- `src/data/socials.js` — real GitHub/LinkedIn/email links.
- `src/data/journey.js` — your real timeline.
- `src/data/services.js` — services you actually offer.
- `src/data/skills.js` — your actual stack.
- `.env.local` — the optional public contact email; keep Telegram credentials only in encrypted Cloudflare secrets.

Do not publish placeholder URLs such as `yourusername`, `project-one-demo.com`, or `you@example.com`.

## Launch checklist

### Functional

- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] Home navigation works.
- [ ] Mobile menu opens, scrolls, traps focus, and closes with Escape.
- [ ] Theme persists after refresh and works on Contact.
- [ ] Project modal opens/closes smoothly.
- [ ] Contact form succeeds on the deployed domain.
- [ ] Contact form failure state is tested.
- [ ] Direct `/contact` navigation works.
- [ ] Unknown routes show the 404 page.
- [ ] External links point to real destinations.

### Content

- [ ] Real project case studies are inserted.
- [ ] Real social links are inserted.
- [ ] Real contact email is configured.
- [ ] No placeholder text remains.
- [ ] All project images have meaningful alt text.
- [ ] Copyright/year and personal information are correct.

### Performance

- [ ] Test production build, not only `npm run dev`.
- [ ] Run Lighthouse on mobile and desktop.
- [ ] Check LCP, CLS and INP/TBT.
- [ ] Verify project images remain compressed.
- [ ] Test on a mid-range mobile device.
- [ ] Test with `prefers-reduced-motion`.

## Architecture notes

- The global cinematic background is only mounted on the Home experience.
- Contact has its own short, independent cinematic environment.
- Lenis is registered centrally so modal/theme interactions can pause it safely.
- Project card autoplay only runs while a card is visible.
- Reduced-motion users receive a less animated experience.
- The contact form has client-side validation, timeout handling, accessible status messaging, a honeypot field, and supports multiple simultaneous contact methods with server-side validation for every selected method.
- No secret API key is shipped to the browser.

## Language & Persian mode

The site now supports English and Persian from the same UI. The selected language is persisted in `localStorage`, updates the document `lang`/`dir`, and switches the interface to RTL with Vazirmatn typography. Persian copy is written as natural conversational Persian rather than word-for-word translation.

The language switcher is available in the desktop header, mobile navigation, and Contact page.

## Loading states

Routes are lazy-loaded with a themed page skeleton, and project images show lightweight skeleton placeholders while the actual image is loading. This keeps the first interaction feeling intentional without adding artificial delays.
