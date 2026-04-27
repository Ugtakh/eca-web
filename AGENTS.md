# ECA Website Agent Instructions

## Project Overview
This is a Next.js-based website for ECA (Mongolian company) with a headless CMS powered by Appwrite. Features include bilingual content (Mongolian/English), admin panel for content management, and sections for services, projects, team, etc.

## Key Conventions
- **Bilingual Content**: Use Mongolian for primary labels, English for subtitles/descriptions
- **Dark Theme**: Background #0A0B0F, accent #4F8EF7, secondary #1476ff
- **Component Naming**: PascalCase for components, kebab-case for files
- **Error Handling**: Always provide fallback content, use `toast.error()` for user feedback
- **Auth Pattern**: Dual Appwrite clients (admin vs session), server actions for auth operations

## Build & Test Commands
- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Auto-fix linting issues
- `npm run format` - Format code with Prettier
- `npm run type-check` - TypeScript validation

**Note**: No test suite exists - manual testing only.

## Architecture Decisions
- **CMS Pattern**: Appwrite tables for content storage, server actions for updates, client-side forms for admin
- **Data Fetching**: Parallel Promise.all on home page, force-dynamic rendering, unstable_noStore for fresh data
- **Component Boundaries**: Server components for pages, client components for interactive sections
- **State Management**: Zustand with persist for auth state
- **Animations**: Custom CSS classes (.reveal-up, .reveal-left) triggered by IntersectionObserver

## Common Pitfalls
- **Appwrite Sessions**: Use correct client factory (createAdminClient vs createSessionClient)
- **Cache Invalidation**: Always call revalidatePath() after CMS updates
- **Image Hosts**: Add external domains to image-hosts.config.mjs
- **Type Safety**: Use normalize*() functions for CMS data
- **Environment Variables**: Ensure all APPWRITE_* and NEXT_PUBLIC_* vars are set

## Development Setup
See [README.md](README.md) for detailed setup instructions. Requires Node.js 18+, pnpm package manager, and Appwrite instance.

## Key Files
- [src/lib/cms/](src/lib/cms/) - CMS type definitions and data normalization
- [src/lib/actions/](src/lib/actions/) - Server actions for auth and content updates
- [src/app/admin/](src/app/admin/) - Admin panel pages and forms
- [src/components/sections/](src/components/sections/) - Main page sections
- [src/store/auth.store.ts](src/store/auth.store.ts) - Auth state management

For detailed architecture patterns, see [/memories/repo/eca-website-patterns.md](/memories/repo/eca-website-patterns.md).