<h1 align="center">Supplier Portal — Frontend</h1>

<p align="center">
  A modern <strong>Next.js 16</strong> application for managing the supplier onboarding workflow.<br/>
  Built with React 19 · TypeScript · TailwindCSS v4 · TanStack Query · shadcn/ui
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=for-the-badge" />
</p>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages & Routing](#pages--routing)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [State Management](#state-management)
- [Form Validation](#form-validation)
- [Authentication Flow](#authentication-flow)
- [Supplier Workflow](#supplier-workflow)
- [Resources](#resources)

---

## Overview

The **Supplier Portal Frontend** is a Next.js App Router application that provides a complete UI for the supplier management lifecycle. Users log in with a role (`REQUESTER` or `APPROVER`), and the interface adapts dynamically — showing available actions based on the user's role and each supplier's current status.

It communicates with the [Supplier Portal Backend API](../backend/README.md) via a centralized Axios service layer, with full server-state management powered by **TanStack Query v5**.

---

## Features

- 🔐 **JWT Authentication** — Login/logout with cookie-based token management and auto-refresh
- 👥 **Role-Aware UI** — Interface adapts dynamically for `REQUESTER` and `APPROVER` roles
- 📋 **Supplier List** — Paginated, real-time supplier table with status badges
- 🔍 **Supplier Detail** — Full supplier detail page with action buttons based on role and status
- ➕ **Create Supplier** — Validated form to create new suppliers in `DRAFT` status
- ✅ **Submit / Approve / Reject** — Inline workflow actions with optimistic UI and toast feedback
- 📝 **Rejection Modal** — Accessible dialog with required reason field for rejections
- 🌙 **Theme Support** — Dark/light mode via `next-themes`
- 🔔 **Toast Notifications** — Rich, accessible toasts via `sonner`
- ⚡ **TanStack Query** — Server-state caching, background refetching, and devtools
- 🛡️ **Zod Validation** — Schema-driven form validation with `react-hook-form` + `@hookform/resolvers`
- 🎨 **shadcn/ui Components** — Accessible, composable UI primitives with Base UI
- 📱 **Responsive Layout** — Mobile-friendly design with TailwindCSS v4

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| UI Library | [React 19](https://react.dev/) |
| Language | [TypeScript 5](https://www.typescriptlang.org/) |
| Styling | [TailwindCSS v4](https://tailwindcss.com/) |
| Components | [shadcn/ui](https://ui.shadcn.com/) + [Base UI](https://base-ui.com/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Server State | [TanStack Query v5](https://tanstack.com/query/latest) |
| HTTP Client | [Axios](https://axios-http.com/) |
| Form Management | [React Hook Form v7](https://react-hook-form.com/) |
| Validation | [Zod v4](https://zod.dev/) |
| Date Utilities | [date-fns v4](https://date-fns.org/) |
| Toasts | [Sonner](https://sonner.emilkowal.ski/) |
| Font | [Geist](https://vercel.com/font) |
| Linting | ESLint 9 + eslint-config-next |

---

## Project Structure

```
frontend/
├── public/                   # Static assets
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── layout.tsx        # Root layout (providers, navbar, toaster)
│   │   ├── page.tsx          # Home page (redirects to /suppliers)
│   │   ├── globals.css       # Global styles & Tailwind directives
│   │   ├── login/            # Login page
│   │   └── suppliers/
│   │       ├── page.tsx      # Supplier list page
│   │       └── [id]/         # Dynamic supplier detail page
│   ├── components/           # Reusable UI components
│   │   ├── navbar.tsx        # Top navigation bar
│   │   └── ui/               # shadcn/ui primitives (button, dialog, etc.)
│   ├── context/
│   │   └── auth-context.tsx  # Authentication context & provider
│   ├── hooks/                # Custom React hooks
│   ├── lib/
│   │   └── utils.ts          # Utility helpers (cn, etc.)
│   ├── providers/
│   │   └── query-provider.tsx # TanStack Query client provider + devtools
│   ├── services/             # Axios API service layer
│   ├── types/
│   │   └── supplier.ts       # TypeScript interfaces & type definitions
│   └── validations/
│       └── supplier.validations.ts  # Zod schemas for forms
├── components.json           # shadcn/ui configuration
├── next.config.ts            # Next.js configuration
├── tailwind.config.*         # TailwindCSS v4 configuration
├── tsconfig.json             # TypeScript configuration
└── package.json
```

---

## Pages & Routing

| Route | Description | Auth Required |
|-------|-------------|:---:|
| `/` | Redirects to `/suppliers` | ✓ |
| `/login` | Email & password login form | ✗ |
| `/suppliers` | All suppliers list with status badges and filters | ✓ |
| `/suppliers/[id]` | Supplier detail view with workflow action buttons | ✓ |

---

## Prerequisites

| Tool | Minimum Version |
|------|----------------|
| Node.js | `>=20.x` |
| npm | `>=10.x` |

The frontend expects the [backend API](../backend/README.md) to be running at the URL configured in `NEXT_PUBLIC_API_URL`.

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd supplier/frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL to your backend URL
```

### 4. Start the development server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

> **Note:** Make sure the backend API is running at the configured `NEXT_PUBLIC_API_URL` before starting the frontend.

---

## Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```env
# Backend API base URL (no trailing slash)
NEXT_PUBLIC_API_URL=http://localhost:4000
```

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` |  `http://localhost:4000` |

---

## Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build the production bundle
npm run build

# Start the production server (requires npm run build first)
npm run start

# Lint the codebase
npm run lint
```

---

## State Management

Server state is managed with **TanStack Query v5**, providing:

- **Automatic caching** of supplier lists and individual supplier records
- **Background refetching** to keep data fresh
- **Optimistic updates** for a snappy user experience on mutations
- **Built-in devtools** for inspecting query state during development

```
src/
└── providers/
    └── query-provider.tsx   # QueryClient configuration + ReactQueryDevtools
```

Local UI state (auth, modals) is handled with React's built-in `useState` / `useContext` via the `AuthContext`.

---

## Form Validation

All forms are validated with **Zod** schemas and integrated via **React Hook Form** + `@hookform/resolvers/zod`.

### Create Supplier Schema

```typescript
const createSupplierSchema = z.object({
  companyName: z.string().min(1, 'Company name is required').trim(),
  vatId:        z.string().min(1, 'VAT ID is required').trim(),
  country:      z.string().min(1, 'Country is required').trim(),
  contactEmail: z.string().min(1, 'Email is required').email('Invalid email address').trim(),
});
```

### Reject Supplier Schema

```typescript
const rejectSupplierSchema = z.object({
  reason: z.string().min(1, 'Rejection reason is required').trim(),
});
```

---

## Authentication Flow

```
User enters credentials
        │
        ▼
POST /api/auth/login
        │
        ▼
Server sets httpOnly cookies:
  access_token  (24h)
  refresh_token (7d)
        │
        ▼
AuthContext stores user + role
        │
        ▼
Protected routes check auth state
  │                    │
  ✓ Authenticated       ✗ Not authenticated
  │                    │
  ▼                    ▼
/suppliers           /login
```

- Auth state is managed in `AuthContext` (`src/context/auth-context.tsx`).
- Axios interceptors automatically handle token refresh on `401` responses.
- All cookies are `httpOnly` — JavaScript never directly accesses tokens.

---

## Supplier Workflow

The UI renders available actions based on the authenticated user's role and the supplier's current status:

| Supplier Status | REQUESTER can | APPROVER can |
|----------------|---------------|--------------|
| `DRAFT` | Submit | Submit |
| `PENDING_APPROVAL` | — | Approve, Reject |
| `APPROVED` | — | — |
| `REJECTED` | — | — |

> **Note:** An APPROVER who created a supplier cannot approve or reject it. The backend enforces this rule and returns a `400 SELF_APPROVAL_NOT_ALLOWED` error.

### Status Badges

| Status | Badge Color |
|--------|-------------|
| `DRAFT` | Gray |
| `PENDING_APPROVAL` | Amber / Yellow |
| `APPROVED` | Green |
| `REJECTED` | Red |

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TailwindCSS v4 Docs](https://tailwindcss.com/docs)
- [TanStack Query Docs](https://tanstack.com/query/latest/docs/framework/react/overview)
- [shadcn/ui Components](https://ui.shadcn.com/docs)
- [React Hook Form Docs](https://react-hook-form.com/get-started)
- [Zod Documentation](https://zod.dev/)
- [Sonner Toast Library](https://sonner.emilkowal.ski/)
- [Backend API README](../backend/README.md)
- [Live API Docs (local)](http://localhost:4000/api/docs)