# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev          # Dev server (port 4028)
bun run build        # Production build
bun run lint         # ESLint
bun run lint:fix     # Auto-fix lint issues
bun run format       # Prettier (src/**/*.{ts,tsx,css,md,json})
bun run type-check   # tsc --noEmit
```

No test suite — manual testing only.

## Architecture

**ECA** is a Next.js 15 (App Router) website for a Mongolian engineering company with a headless CMS backed by Appwrite. Content is bilingual (Mongolian primary, English secondary).

### Data flow

The home page (`src/app/page.tsx`) is `force-dynamic` and fetches all CMS sections in parallel via `Promise.all`. Each section follows a three-layer pattern:

1. **`src/lib/cms/<section>.ts`** — TypeScript types, `normalize*()` functions, `defaultContent`, and `get`/`save` functions that talk directly to Appwrite TablesDB. Uses `unstable_noStore` to bypass Next.js cache. Each section stores its content as a single JSON blob (`payload` field) in a dedicated table with a fixed row ID.

2. **`src/lib/actions/<section>.ts`** — `'use server'` actions that guard with `requireAdminUser()`, call the CMS layer, then call `revalidatePath('/')` and `revalidatePath('/admin/<section>')`.

3. **`src/app/admin/<section>/`** — `'use client'` form components that call the server actions.

### Appwrite clients

Two factories in `src/lib/appwrite/client.ts` (server-only, `'use server'`):

- **`createAdminClient()`** — uses `NEXT_PUBLIC_APPWRITE_API_KEY`; used for all CMS reads/writes and auth operations.
- **`createSessionClient()`** — reads the `session` cookie; used to verify logged-in user identity.

There is also a legacy browser client in `src/lib/appwrite/config.ts` (used by the Zustand store), but admin auth flows go through server actions.

### Auth

- Sign-in stores the session secret in an httpOnly `session` cookie via `src/lib/actions/auth.ts`.
- `src/app/admin/layout.tsx` calls `getUser()` (which uses `createSessionClient`) and redirects to `/auth` if no session.
- Client-side `useAuthStore` (Zustand + persist) in `src/store/auth.store.ts` mirrors session state for UI use.

### Styling

Dark theme — key Tailwind tokens: `background: #0A0B0F`, `accent: #4F8EF7`, `secondary: #1476ff`. Full palette and custom animations (float, pulseRing, spark) are in `tailwind.config.js`.

Scroll reveal animations use CSS classes `.reveal-up` / `.reveal-left` driven by an `IntersectionObserver` initialized in `ScrollAnimationInit` (client component rendered once on the home page).

### Image hosts

External image domains must be registered in `image-hosts.config.mjs` (imported by `next.config`). The Appwrite storage hostname is derived automatically from `NEXT_PUBLIC_APPWRITE_ENDPOINT`.

## Environment Variables

```
NEXT_PUBLIC_APPWRITE_ENDPOINT
NEXT_PUBLIC_APPWRITE_PROJECT_ID
NEXT_PUBLIC_APPWRITE_API_KEY
NEXT_PUBLIC_APPWRITE_DATABASE_ID
NEXT_PUBLIC_APPWRITE_BUCKET_ID
APPWRITE_HERO_SECTION_TABLE_ID   # optional, falls back to 'heroSectionCms'
# similar APPWRITE_*_TABLE_ID vars for other sections
```

## Key Conventions

- **Bilingual**: Mongolian for primary labels/titles, English for subtitles/descriptions.
- **CMS tables are auto-created** on first read via `ensureTable()` inside each `src/lib/cms/*.ts` file — no manual Appwrite setup needed beyond the database.
- **Normalize everything**: always pass CMS data through `normalize*()` before using or saving it; these functions apply defaults and handle legacy schema shapes.
- **`revalidatePath` is mandatory** after every CMS write — both `'/'` and the admin path.
- **Server components for pages, client components for forms** — the boundary is consistently at the `*CmsForm.tsx` level.
