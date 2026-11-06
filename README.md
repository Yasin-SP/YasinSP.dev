# Yasin — Premium Front-End Portfolio

A React portfolio with an Apple-inspired, content-first design (flat tiles, one blue accent, restrained motion), focused on frontend development, interface craft, responsive engineering, and purposeful motion.

## Stack

- React 19
- Vite
- Tailwind CSS v4
- Motion
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

## Hosting and contact form

The site is a static build served from a cPanel host in Iran. `public/.htaccess` handles HTTPS, the single-page fallback, caching and security headers; `public/api/contact.php` handles the contact form at `POST /api/contact`.

```bash
npm run build   # output in dist/ — upload its contents (including hidden .htaccess) to public_html
```

### Contact form delivery

Messages are delivered by a Bale messenger bot and/or email, and always appended to `contact-messages.log` in the hosting account's home directory (outside `public_html`). Settings live in `api/config.php` on the server (`bale_token`, `bale_chat_id`, `to_email`, `from_email`); when updating the site, keep that file. Telegram is not used because it is unreachable from servers in Iran.

The only optional client environment value is the public email shortcut: copy `.env.example` to `.env.local` and set `VITE_CONTACT_EMAIL`.

## Content before launch

The codebase is prepared for deployment, but a few personal/content placeholders must be replaced before public launch.

Before publishing, replace:

- `src/data/projects.js` — real project names, descriptions, screenshots, stack, GitHub and live links.
- `src/data/socials.js` — real GitHub/LinkedIn/email links.
- `src/data/journey.js` — your real timeline.
- `src/data/services.js` — services you actually offer.
- `src/data/skills.js` — your actual stack.
- `.env.local` — the optional public contact email.

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
