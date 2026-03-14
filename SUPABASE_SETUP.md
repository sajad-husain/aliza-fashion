# Supabase Backend Setup - Complete Guide

This document explains all Supabase features enabled in the ALIZA e-commerce project.

---

## Table of Contents
1. [Authentication](#1-authentication)
2. [Database Tables](#2-database-tables)
3. [Row Level Security (RLS)](#3-row-level-security-rls)
4. [Storage](#4-storage)
5. [Environment Variables](#5-environment-variables)
6. [Feature Summary](#6-feature-summary)

---

## 1. Authentication

### Email/Password Authentication
- **Provider**: Supabase Auth with email/password
- **Features Used**:
  - User registration with `signUp()`
  - User login with `signInWithPassword()`
  - Session management with `getSession()` and `onAuthStateChange()`
  - User logout with `signOut()`
  - Email verification with `resend()` for verification emails
  - User metadata storage (name, is_admin)

### Admin System
- Admin access is determined by:
  - Email matching `VITE_ADMIN_EMAILS` environment variable (comma-separated)
  - Or `is_admin: true` in Supabase user metadata
- Admin users get full access to manage orders and view all data

### Implementation
```javascript
// From src/context/AuthContext.jsx
- supabase.auth.signUp() - Register new users
- supabase.auth.signInWithPassword() - Login
- supabase.auth.getSession() - Get current session
- supabase.auth.onAuthStateChange() - Listen for auth changes
- supabase.auth.signOut() - Logout
- supabase.auth.resend() - Resend verification email
```

---

## 2. Database Tables

### Products Table
Stores all product inventory with detailed attributes:

| Column | Type | Description |
|--------|------|-------------|
| `id` | bigint | Auto-generated primary key |
| `name` | text | Product name (required) |
| `price` | numeric | Product price in Rs. (required) |
| `image` | text | Legacy image field |
| `image_url` | text | Primary image URL |
| `category` | text | Product category (required) |
| `fabric` | text | Fabric material description |
| `length` | text | Product length info |
| `care` | text | Care instructions |
| `description` | text | Full product description |
| `in_stock` | boolean | Stock status (default: true) |
| `created_at` | timestamptz | Creation timestamp |

### Reviews Table
Customer product reviews with ratings:

| Column | Type | Description |
|--------|------|-------------|
| `id` | bigint | Auto-generated primary key |
| `product_id` | bigint | Foreign key to products |
| `user_id` | uuid | Supabase user ID (optional) |
| `name` | text | Reviewer name |
| `rating` | int | 1-5 star rating |
| `comment` | text | Review text |
| `created_at` | timestamptz | Review timestamp |

**Constraints**: Rating must be between 1-5 (CHECK constraint)

### Orders Table
Customer order tracking:

| Column | Type | Description |
|--------|------|-------------|
| `id` | bigint | Auto-generated primary key |
| `customer_name` | text | Customer full name |
| `customer_email` | text | Customer email |
| `customer_phone` | text | Contact number |
| `customer_address` | text | Delivery address |
| `customer_city` | text | City |
| `items` | jsonb | Order items array |
| `total` | numeric | Order total amount |
| `status` | text | Order status (pending/delivered/not_delivered) |
| `created_at` | timestamptz | Order timestamp |

**Constraints**: Status must be one of: pending, delivered, not_delivered

---

## 3. Row Level Security (RLS)

RLS policies provide granular access control to database tables:

### Products Table Policies

| Policy Name | Operation | Access | Condition |
|-------------|-----------|--------|-----------|
| Public read products | SELECT | anon, authenticated | Anyone can view products |
| Auth insert products | INSERT | authenticated | Logged-in users can add products |

### Reviews Table Policies

| Policy Name | Operation | Access | Condition |
|-------------|-----------|--------|-----------|
| Public read reviews | SELECT | anon, authenticated | Anyone can view reviews |
| Auth insert reviews | INSERT | authenticated | Logged-in users can submit reviews |

### Orders Table Policies

| Policy Name | Operation | Access | Condition |
|-------------|-----------|--------|-----------|
| Public read own orders | SELECT | anon, authenticated | Customers view own orders; Admins view all |
| Auth insert orders | INSERT | authenticated | Authenticated users can place orders |
| Admin manage orders | ALL | authenticated | Admins have full CRUD access |

**Admin Detection Logic**:
```sql
-- Checks if user's email matches app.settings.admin_emails
exists (
  select 1 from auth.users 
  where id = auth.uid() 
  and email in (
    select split_part(trim(value), ',', 1) 
    from unnest(string_to_array(current_setting('app.settings.admin_emails', true), ','))
  )
)
```

---

## 4. Storage

### Product Images Bucket
- **Bucket Name**: `product-images`
- **Purpose**: Store and serve product images
- **Public Access**: Images are publicly readable
- **Upload Access**: Only authenticated users can upload

| Policy | Operation | Access |
|--------|-----------|--------|
| Public read product images | SELECT | anon, authenticated |
| Auth upload product images | INSERT | authenticated |

### Setup Instructions
1. Go to Supabase Dashboard → Storage
2. Create new bucket named `product-images`
3. Make it **public** (not private)
4. RLS policies are automatically applied from schema.sql

---

## 5. Environment Variables

Create `.env` file in project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ADMIN_EMAILS=admin1@example.com,admin2@example.com
```

### Variable Descriptions

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL (found in Settings → API) |
| `VITE_SUPABASE_ANON_KEY` | Anonymous public key (found in Settings → API → Project API keys) |
| `VITE_ADMIN_EMAILS` | Comma-separated list of admin email addresses |

---

## 6. Feature Summary

| Feature | Status | Description |
|---------|--------|-------------|
| **Authentication** | ✅ Enabled | Email/password signup, login, logout, session management |
| **User Metadata** | ✅ Enabled | Stores user name and admin status |
| **Products Database** | ✅ Enabled | Full product catalog with RLS |
| **Reviews System** | ✅ Enabled | Product ratings with 1-5 stars |
| **Orders Management** | ✅ Enabled | Order placement and tracking |
| **Admin Dashboard** | ✅ Enabled | Admin-only order management |
| **Row Level Security** | ✅ Enabled | Table-level access policies |
| **Storage (Images)** | ✅ Enabled | Product image bucket |
| **Real-time Auth** | ✅ Enabled | Auth state change listener |
| **Fallback Mode** | ✅ Enabled | Works without Supabase (localStorage fallback) |

---

