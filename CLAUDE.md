# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Website and private admin CRM for **RIWAJ Weddings & Events**, a wedding and event planner in Rewa, Madhya Pradesh. The business was previously called "Vindhya Events", so that name survives in the domain (`vindhyaevents.in`), the repo, the PM2 app, the DB name, the auth cookie and Cloudinary folders. New user-facing text should say RIWAJ. Some site copy is intentionally Hinglish.

## Commands

```bash
npm run dev              # dev server (webpack)
npm run dev:clean        # clear .next, then dev
npm run build            # production build (webpack)
npm run lint             # eslint
npx tsc --noEmit         # type check
npm run seed:services    # seed services into MongoDB
node scripts/generate-pwa-icons.js   # rebuild logo, favicon and PWA icons
```

There is no test framework. Verify changes with a build and by running the site.

Configuration lives in `.env.local` (gitignored); `.env.example` lists the variables. Running the site locally uses whatever `MONGODB_URI` is set there, and the seed logic below runs against it.

## Deployment

Pushing to `main` deploys to production. `.github/workflows/deploy.yml` SSHes into EC2, runs `git reset --hard origin/main`, `npm install` and `npm run build`, then `pm2 reload vindhyaevents`. Run `npm run build` before pushing to `main`. Day-to-day work happens on `shubham1`, which is then merged into `main`. Vercel is not used.

## Architecture

Next.js 16 App Router with React 18, TypeScript, Tailwind 4 and Mongoose. The path alias `@/*` maps to `src/*`. There is one Next.js app containing both the public site and the admin.

### Data layer

- Always `await connectToDatabase()` (`src/lib/db.ts`) before using a model. Commands are not buffered, so queries fail without it.
- Models are in `src/lib/models/` and re-exported from `index.ts`.
- **Booking** (`Booking.ts`) is the core operational document. It embeds `subEvents[].assignedPersons[]`, `vendorPayouts[]` with installment history, and `financials` with `paymentHistory[]`.
  - Each booking links to a customer by `customerId` and also stores a `customerSnapshot` copy.
  - `src/app/api/admin/bookings/route.ts` recalculates balances and statuses on the server. It also maintains `Customer.totalBookingsCount` and `totalSpent` with `$inc`, so check that route before changing money logic.
- **Inquiry** is a website lead. It has its own smaller vendor list and is separate from `Booking`.
- **SiteSetting** is a single document (`findOne()`) holding contacts, hero slides, stats, theme and the WhatsApp API credentials.

### Seeding runs at request time

`seedDatabaseIfEmpty()` (`src/lib/seed.ts`) runs on every login and every `/api/public/content` request, not just once. Each run:

- **Deletes data:** `purgePredefinedDemoData()` removes demo records, including team, testimonial, blog and gallery records whose image URL contains `unsplash.com`. Anything admins add with such an image is deleted.
- **Overwrites contacts:** it resets `SiteSetting` phone, WhatsApp and email to hard-coded values, so edits made in the admin don't persist. To change them, update `seed.ts` and `settingsDefaults.ts`.
- Creates the default admin, the `SiteSetting` document and `SubCategory` records if they are missing.

`getSiteSettings.ts` and the public settings and content routes also replace old phone numbers and "vindhya" emails when reading.

### Public site

- The root layout loads settings server-side via `getSiteSettings()` and passes them to `SettingsProvider`. It is `force-dynamic`, so pages are not statically cached.
- Client components get content from `useInstantContent` (`src/lib/cache/`). It reads IndexedDB first and refreshes from `/api/public/content` in the background. In development it always fetches fresh. Inquiries made offline are queued in IndexedDB and synced later.
- `src/app/[eventSlug]/page.tsx` renders event pages from the static `src/data/eventRoutes.ts`. Images and titles can be overridden by the matching `SubCategory` document. A new event needs an entry in `eventRoutes.ts`; existing databases won't get a new `SubCategory` automatically because seeding only runs when that collection is empty.
- Themes are CSS variables (`--c-primary` and so on) defined in `src/context/ThemeContext.tsx`. Style with these rather than fixed colours on public pages.
- `public/sw.js` caches pages and assets. Bump `CACHE_NAME` and `RUNTIME_CACHE` when changing cached assets such as icons. `public/manifest.json` and `src/app/manifest.ts` are duplicates, so keep them in sync.

### Admin

- `src/middleware.ts` guards only the `/admin` pages and `/login`. **It does not cover APIs**, so every `/api/admin/*` handler must call `getAdminFromRequest(req)` itself and return 401, following `src/app/api/admin/services/route.ts`.
- Sessions are a 7-day HS256 JWT in the httpOnly `vindhya_admin_token` cookie (`src/lib/auth.ts`). The fallback secret is duplicated in `auth.ts` and `middleware.ts`.
- The `superadmin`/`editor` role is stored but not enforced by the APIs.
- The admin UI is very large: `src/app/admin/page.tsx` (tabs, ~7.5k lines), with `components/admin/BookingManagement.tsx` (~5.9k), `CustomerCRM.tsx` (~2.8k) and `WhatsAppCenter.tsx`. Search for the tab id (`activeTab === "..."`) rather than reading whole files.

### Integrations

- **Images:** go through `/api/upload` to Cloudinary (`src/lib/cloudinary.ts`), converted to WebP. Delete with `safeDeleteCloudinaryImage`, which ignores non-Cloudinary URLs. `next.config.mjs` sets `images.unoptimized: true`, so files are served at full size; keep them small.
- **WhatsApp:** `src/lib/whatsapp.ts` sends through Meta's Cloud API or builds a `wa.me` link. Credentials saved in `SiteSetting` take priority over env vars. Sends are logged in `WhatsAppLog`.
- **Email and bot checks:** `/api/bookconsultation` saves the inquiry, emails via Nodemailer (`src/lib/backendhelper/email.ts`) without blocking the response, and checks Turnstile only when a token is sent.
- **Analytics:** the Google Analytics tag `G-39TJ68LG6V` is in `src/app/layout.tsx`.

### Branding assets

`scripts/generate-pwa-icons.js` builds `public/riwaj-logo.png`, `src/app/favicon.ico` and the `public/icons/` app icons from `scripts/assets/riwaj-logo-source.jpg`. To change the logo, replace the source image and rerun the script rather than editing the outputs. The notification badge is a separate inline SVG in that script.

## Known issues

These were found by reading the code and have not been fixed:

- **Token exposure:** `/api/public/settings` and `/api/public/content` spread the whole `SiteSetting` document into their responses, including `whatsAppAccessToken`.
- **Missing auth:** `/api/admin/works` has no login check on any method.
- **Hard-coded fallbacks:** the JWT secret and default admin password have fallbacks in source, and `.env.example` contains what look like real Turnstile keys.
- **Missing assets:** `/og-image.jpg`, `/girlsimg.webp` and `/dercoration1.webp` are referenced but not in `public/`. `sw.js` precaches the two `.webp` files, so `cache.addAll` fails and precaching doesn't complete.
- **Deprecation:** Next.js warns that the `middleware` file convention should become `proxy`.
