# Technical Context

## Technologies Used

### Core Framework
- **Next.js**: App Router implementation for file-system based routing, server components, and optimized rendering
- **React**: Component-based UI library
- **TypeScript**: Typed JavaScript superset for better developer experience and code safety

### Content Management
- **TinaCMS**: Headless CMS with visual editing capabilities
- **Markdown/MDX**: Content format with embedded components
- **JSON Schema**: Content validation and structure definition

### Styling & UI
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: Component collection built on Radix UI
- **Radix UI**: Unstyled, accessible component primitives

### Package Management
- **PNPM**: Fast, disk-space efficient package manager

### Dev Tooling
- **ESLint**: JavaScript/TypeScript linting
- **Biome**: Fast linting and formatting
- **VS Code**: Recommended editor with configuration

## Development Setup
- Clone repository
- Copy `.env.example` to `.env` and configure environment variables
- Run `pnpm install` to install dependencies
- Run `pnpm dev` to start development server
- Edit content through the TinaCMS interface at `/admin`

## Technical Constraints
- Requires Node.js 18+
- TinaCMS requires configured environment variables
- Local development requires proper setup for content editing

## Dependencies
Major dependencies include:
- next
- react
- tinacms
- tailwindcss
- shadcn/ui components
- typescript

## Build & Deployment
- **Build Command**: `pnpm build`
- **Preview Command**: `pnpm start`
- **Deployment Options**: Vercel (recommended), Netlify, or any static hosting 