# 🚀 Weavy Clone - Setup Guide

## Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Google Generative AI (Gemini)
# Get your API key from: https://aistudio.google.com/app/apikey
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key_here

# MongoDB Database
# Get connection string from: https://cloud.mongodb.com/
MONGODB_URI=your_mongodb_connection_string_here

# Clerk Authentication
# Get keys from: https://dashboard.clerk.com/
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Cloudinary (Image Storage)
# Get credentials from: https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name_here
CLOUDINARY_API_KEY=your_cloudinary_api_key_here
CLOUDINARY_API_SECRET=your_cloudinary_api_secret_here

# Uploadcare (File Upload)
# Get key from: https://uploadcare.com/dashboard/
NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY=your_uploadcare_public_key_here
```

## Getting API Keys

### 1. Google Generative AI (Gemini)
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it in `.env.local`

### 2. MongoDB
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free account or sign in
3. Create a new cluster (free tier available)
4. Click "Connect" → "Connect your application"
5. Copy the connection string and replace `<password>` with your database password

### 3. Clerk (Authentication)
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Copy the publishable key and secret key from the API Keys section

### 4. Cloudinary (Image Storage)
1. Go to [Cloudinary Console](https://cloudinary.com/console)
2. Sign up for a free account
3. Copy the Cloud Name, API Key, and API Secret from the dashboard

### 5. Uploadcare (File Upload)
1. Go to [Uploadcare Dashboard](https://uploadcare.com/dashboard/)
2. Sign up for a free account
3. Copy the Public Key from the dashboard

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Custom Weavy Colors

The following custom colors have been configured in `globals.css`:

- **Primary Purple**: `#7C3AED` (weavy-primary)
- **Light Background**: `#F8FAFC` (weavy-background)
- **Grid Color**: `#E2E8F0` (weavy-grid)
- **Dark Background**: `#0A0A0A` (weavy-dark-bg)
- **Card Background**: `#1A1A1A` (weavy-card)
- **Border Color**: `#2A2A2A` (weavy-border)
- **Purple Light**: `#8B5CF6` (weavy-purple-light)
- **Purple Dark**: `#6D28D9` (weavy-purple-dark)

Use these colors in your components with Tailwind classes:
- `bg-weavy-primary`
- `text-weavy-primary`
- `border-weavy-border`
- etc.

## TypeScript Configuration

Strict mode is enabled with the following additional checks:
- `strictNullChecks`
- `strictFunctionTypes`
- `noImplicitAny`
- `noUnusedLocals`
- `noUnusedParameters`

Path aliases configured:
- `@/*` → root directory
- `@/components/*` → components directory
- `@/lib/*` → lib directory
- `@/types/*` → types directory
- `@/app/*` → app directory

