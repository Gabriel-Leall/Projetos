# Next.js Modern Stack Application

A full-stack Next.js application with dark theme, social authentication, and subscription management.

## Tech Stack

- **Frontend**: Next.js 14 with App Router, React 19
- **UI Components**: Shadcn/UI (Tailwind CSS)
- **Authentication**: NextAuth.js with Google OAuth and Prisma adapter
- **Database**: PostgreSQL with Prisma ORM
- **API**: tRPC for type-safe API communication
- **Payments**: Stripe integration for subscription management
- **State Management**: Zustand

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd <repo-folder>
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase"

# NextAuth
NEXTAUTH_SECRET="this-is-a-secret-value-for-nextauth-encryption"
NEXTAUTH_URL="http://localhost:3000"

# OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_stripe_webhook_secret"
STRIPE_PRODUCT_ID="prod_your_stripe_product_id"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
NEXT_PUBLIC_STRIPE_PRICE_ID="price_your_stripe_price_id"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. Initialize the database:

```bash
npx prisma migrate dev --name init
```

5. Run the development server:

```bash
npm run dev
```

## Features

- **Authentication**: Sign in with Google
- **Dark/Light Theme**: Toggle between themes with persistent state
- **User Dashboard**: View profile and subscription status
- **Subscription Management**: Subscribe to plans using Stripe
- **Type-safe API**: End-to-end type safety with tRPC
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## Project Structure

- `/src/app` - Next.js App Router pages and API routes
- `/src/components` - Reusable UI components
- `/src/lib` - Utility functions, hooks, and configuration
- `/src/server` - Server-side code including tRPC routers
- `/prisma` - Database schema and migrations

## Deployment

This application can be deployed to Vercel or any other platform that supports Next.js applications.

## License

MIT
