# VLSI Frontend - Next.js Application

## Getting Started

This is the frontend application for the VLSI GVPCE(A) website, built with Next.js 15, React Query, and TailwindCSS.

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME="VLSID GVPCE(A)"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: JavaScript
- **Styling**: TailwindCSS v4
- **Data Fetching**: React Query (@tanstack/react-query)
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form + Zod validation
- **UI Components**: shadcn/ui (Radix UI)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: Sonner

## Project Structure

```
vlsi-frontend/
├── src/
│   ├── app/           # Next.js app router pages
│   ├── components/    # Reusable components
│   │   └── ui/       # shadcn/ui components
│   ├── contexts/      # React contexts (Auth, etc.)
│   ├── providers/     # Provider components
│   ├── lib/           # Utility functions
│   │   ├── api/      # API client and config
│   │   └── utils.js  # Helper functions
│   └── hooks/         # Custom React hooks
├── public/            # Static assets
├── components.json    # shadcn/ui configuration
└── tailwind.config.js # TailwindCSS configuration
```

## Features

- ✅ JWT-based authentication with auto token refresh
- ✅ API client with request/response interceptors
- ✅ React Query for server state management
- ✅ shadcn/ui component library integration
- ✅ Responsive design with TailwindCSS
- ✅ Framer Motion animations ready
- ✅ Form validation with Zod and React Hook Form

## API Integration

The frontend is designed to work with a NestJS backend. All API endpoints are configured in `src/lib/api/config.js`.

Base API URL is set via `NEXT_PUBLIC_API_URL` environment variable.

## Authentication

Authentication is handled via JWT tokens stored in localStorage. The `AuthContext` provides:

- `user`: Current user object
- `loading`: Auth state loading indicator
- `login(email, password)`: Login function
- `register(userData)`: Registration function
- `logout()`: Logout function
- `checkAuth()`: Check authentication status

## Next Steps

1. Set up backend NestJS API
2. Implement page layouts and components
3. Create authentication pages (login/register)
4. Build dashboard and admin pages
5. Implement all resource pages
6. Add Figma integration for design system
