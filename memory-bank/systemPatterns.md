# System Patterns

## Architecture Overview
The Tina Cloud Starter follows a modern JAMstack architecture with the following key components:
- Next.js for the frontend and server-side rendering/static site generation
- TinaCMS for content management and editing
- Markdown/MDX for content storage
- TypeScript for type safety across the application

## Design Patterns

### Content Management
- **Content as Data**: Content is stored as structured data (MDX/JSON) with schema validation
- **Visual Editing**: In-context editing with TinaCMS
- **Content Fetching**: Server-side data fetching for content with client-side hydration

### Component Architecture
- **Component Composition**: Building complex UIs from simpler, reusable components
- **Server Components**: Utilizing Next.js server components for content-heavy pages
- **Client Components**: Using client components for interactive elements
- **Shadcn UI + Radix UI**: Accessible, composable component library integration

### Routing and Navigation
- **App Router**: Next.js App Router for file-system based routing
- **Dynamic Routes**: Content-based dynamic route generation
- **Static Optimization**: Prerendering static pages for performance

### State Management
- **Server State**: Content managed on the server side through TinaCMS
- **Client State**: Minimal client-side state for interactivity
- **URL State**: Using URL parameters for shareable state

## Key Technical Decisions
- Using Next.js App Router over Pages Router for better performance and features
- Choosing TinaCMS for its developer experience and visual editing capabilities
- Using TypeScript for type safety and better developer experience
- Implementing Tailwind CSS for utility-first styling
- Adopting Shadcn UI + Radix UI for accessible components

## Component Relationships
- **Page Templates** → Serve as the foundation for different page types
- **Layout Components** → Define the visual structure of pages
- **Content Components** → Display various content types from TinaCMS
- **UI Components** → Provide interactive elements and visual styling
- **Utility Functions** → Handle data transformation and business logic 