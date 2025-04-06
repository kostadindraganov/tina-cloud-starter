# Tina Cloud Starter Development Guide

## Commands
- `pnpm dev` - Start development server with TinaCMS
- `pnpm build` - Build for production
- `pnpm build-local` - Build locally without cloud checks
- `pnpm lint` - Run Biome linter
- `pnpm dev:build` - Build Next.js app only

## Code Style
- Use TypeScript with proper types; prefer interfaces
- Write functional React components (no classes)
- Use single quotes for strings and JSX attributes
- Follow mobile-first responsive design using Tailwind
- Keep files under 300 lines; refactor when needed
- Follow component structure: exports first, subcomponents, helpers, types
- Prefer named exports for components
- Use Shadcn UI and Radix UI primitives for components
- Minimize 'use client' directives; favor React Server Components
- Use descriptive variable names with auxiliary verbs (isLoading, hasError)
- Keep TypeScript strict mode enabled
- Avoid type 'any' - use proper typing everywhere

## Patterns
- Apply SOLID principles in all code organization
- Use composition over inheritance for component design
- Implement proper Next.js App Router patterns
- Follow TinaCMS schema best practices for content modeling