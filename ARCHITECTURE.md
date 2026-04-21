# Architecture Document

## Overview
This is a modern Next.js 16 application built with TypeScript, Tailwind CSS, and a comprehensive set of libraries for production-ready web development. The application follows the App Router pattern and implements various architectural patterns for scalability and maintainability.

## Technology Stack

### Core Framework
- **Next.js 16** - React framework with App Router for server-side rendering and static site generation
- **React 19** - Component-based UI library
- **TypeScript 5** - Static type checking and enhanced developer experience
- **Tailwind CSS 4** - Utility-first CSS framework

### UI Components & Styling
- **shadcn/ui** - Accessible UI components built on Radix UI
- **Lucide React** - Icon library
- **Framer Motion** - Animation library
- **Tailwind CSS Animate** - Animation utilities

### Forms & Validation
- **React Hook Form** - Performant form handling
- **Zod** - Schema validation

### State Management & Data Fetching
- **Zustand** - Lightweight state management
- **TanStack Query** - Server state management and caching
- **Fetch API** - Standard web API for HTTP requests

### Database & Backend
- **Prisma ORM** - Type-safe database access
- **NextAuth.js** - Authentication solution

### Advanced UI Features
- **TanStack Table** - Data table implementation
- **DND Kit** - Drag and drop functionality
- **Recharts** - Charting library
- **Sharp** - Image processing

### Internationalization & Utilities
- **Next Intl** - Internationalization
- **Date-fns** - Date manipulation
- **ReactUse** - Collection of React hooks

## Project Structure

```
src/
├── app/                    # Next.js App Router pages and routes
│   ├── api/               # API routes
│   │   ├── github/        # GitHub integration endpoints
│   │   ├── modules/       # Module-related endpoints
│   │   ├── phases/        # Phase-related endpoints
│   │   ├── projects/      # Project-related endpoints
│   │   ├── sse/           # Server-sent events endpoints
│   │   ├── stats/         # Statistics endpoints
│   │   ├── tasks/         # Task-related endpoints
│   │   └── webhooks/      # Webhook endpoints
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable React components
│   ├── dashboard/         # Dashboard-specific components
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
│   ├── use-mobile.ts     # Mobile device detection hook
│   └── use-toast.ts      # Toast notification hook
└── lib/                  # Utility functions and configurations
    ├── db.ts             # Database connection utilities
    └── utils.ts          # General utility functions
```

## Deployment Configuration

The project is configured for deployment on both Vercel and Netlify:

### Vercel
- Uses Next.js framework features
- Optimized for server-side rendering and static generation
- Environment variables support

### Netlify
- Configured via `netlify.toml`
- Supports server-side rendering and edge functions

## Key Features

1. **Authentication**: NextAuth.js integration for secure user authentication
2. **Database**: Prisma ORM for type-safe database operations
3. **API Layer**: RESTful API endpoints in the app/api directory
4. **State Management**: Client-side state with Zustand, server state with TanStack Query
5. **Internationalization**: Multi-language support with Next Intl
6. **Responsive Design**: Mobile-first approach with Tailwind CSS
7. **Accessibility**: Built-in accessibility features through Radix UI
8. **Performance**: Optimized for Core Web Vitals and fast loading times

## Development Workflow

- Development server: `bun run dev`
- Production build: `bun run build`
- Production start: `bun run start`
- Database operations: Prisma migration and seed scripts

## Security Considerations

- Type safety throughout the application
- Secure authentication with NextAuth.js
- Proper input validation with Zod
- Sanitized output rendering