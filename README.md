# ALIZA - Premium Unstitched Fabrics E-Commerce Store

A full-featured e-commerce website built with React, Vite, and Supabase for selling premium Pakistani unstitched fabrics (lawn, cotton, silk) for Men, Women, and Kids.

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Backend Setup (Supabase)](#backend-setup-supabase)
- [Deployment](#deployment)
- [Customization Guide](#customization-guide)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)

---

## Project Overview

**ALIZA** is an e-commerce platform specializing in premium Pakistani unstitched fabrics. The application provides a complete shopping experience including:

- Product browsing with categories (Women, Men, Kids)
- Product search and filtering
- Shopping cart functionality
- User authentication (login/register)
- Wishlist management
- Checkout flow
- Admin dashboard for product and order management
- WhatsApp contact integration

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend Framework | React 18 |
| Build Tool | Vite 5 |
| Routing | React Router DOM 6 |
| Backend/DB | Supabase (PostgreSQL) |
| Icons | React Icons |
| Styling | Custom CSS (no framework) |
| State Management | React Context API |
| Deployment | Vercel |

---

## Project Structure

```
ALIZA/
├── index.html                 # Main HTML entry point
├── package.json               # Dependencies and scripts
├── vite.config.js            # Vite configuration
├── vercel.json               # Vercel deployment config
├── .env                      # Environment variables
├── public/                   # Static public assets
│   ├── sitemap.xml
│   └── robots.txt
├── src/
│   ├── main.jsx              # React entry point
│   ├── App.jsx               # Main app component with routing
│   ├── styles.css            # Global styles (~3670 lines)
│   ├── data.js               # Static product/category data
│   ├── lib/
│   │   └── supabase.js       # Supabase client configuration
│   ├── components/
│   │   ├── Navbar.jsx         # Main navigation header
│   │   ├── Footer.jsx         # Site footer
│   │   ├── Hero.jsx           # Homepage hero section
│   │   ├── FeaturedProducts.jsx
│   │   ├── Categories.jsx     # Category navigation
│   │   ├── CollectionSpotlight.jsx
│   │   ├── LookbookSection.jsx
│   │   ├── AboutBrand.jsx
│   │   ├── WhyChooseUs.jsx
│   │   ├── TrustStrip.jsx
│   │   ├── Newsletter.jsx
│   │   ├── SearchBar.jsx
│   │   ├── CartIcon.jsx
│   │   ├── CartDrawer.jsx      # Slide-out cart
│   │   ├── WishlistButton.jsx
│   │   ├── QuickViewModal.jsx
│   │   ├── SizeGuideModal.jsx
│   │   ├── WhatsAppButton.jsx # WhatsApp floating button
│   │   ├── MobileBottomNav.jsx
│   │   └── AdminRoute.jsx     # Protected admin route wrapper
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── ProductsPage.jsx
│   │   ├── ProductDetailsPage.jsx
│   │   ├── SearchResultsPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── WishlistPage.jsx
│   │   ├── ContactPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── AdminDashboardPage.jsx
│   └── context/
│       ├── AuthContext.jsx     # Authentication state management
│       ├── CartContext.jsx    # Shopping cart state
│       ├── WishlistContext.jsx
│       ├── ProductsContext.jsx
│       └── ToastContext.jsx   # Toast notifications
├── supabase/
│   ├── schema.sql             # Database schema
│   ├── fix_rls.sql            # Row Level Security policies
│   └── seed_products.sql      # Sample product data
└── dist/                      # Production build output
```

---

## Features

### Customer Features
- **Product Catalog**: Browse products by category (Women, Men, Kids)
- **Product Details**: View detailed product info (fabric, length, care instructions)
- **Search**: Search products by name/description
- **Shopping Cart**: Add/remove items, update quantities
- **Wishlist**: Save favorite products
- **User Authentication**: Register and login functionality
- **Checkout**: Place orders with customer details
- **Contact**: Contact form and WhatsApp integration

### Admin Features
- **Admin Dashboard**: `/admin` route (protected)
- **Product Management**: Add, edit, delete products
- **Image Upload**: Upload product images to Supabase Storage
- **Order Management**: View and update order status (pending/delivered/not_delivered)

### Technical Features
- **Responsive Design**: Mobile-first with bottom navigation
- **Code Splitting**: Lazy loading for pages
- **SEO Optimized**: Meta tags, Open Graph, sitemap, structured data
- **Offline Support**: Works without Supabase (uses localStorage fallback)
- **Toast Notifications**: User feedback system

---

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn

### Installation

```bash
# Clone or navigate to project
cd ALIZA

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build locally |

---

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Supabase Configuration (Required for backend features)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Storage Bucket (Optional - defaults to "product-images")
VITE_SUPABASE_PRODUCTS_BUCKET=product-images

# Admin Emails (comma-separated - these users get admin access)
VITE_ADMIN_EMAILS=admin@example.com,another-admin@example.com
```

### Key Environment Variables Explained

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Yes | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `VITE_SUPABASE_PRODUCTS_BUCKET` | No | Storage bucket name for product images |
| `VITE_ADMIN_EMAILS` | No | Comma-separated admin email addresses |

---

## Backend Setup (Supabase)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your `Project URL` and `anon key`

### 2. Run Database Schema

Execute the SQL in `supabase/schema.sql` in the Supabase SQL Editor:

```sql
-- Creates tables: products, orders
-- Creates storage bucket: product-images
-- Sets up basic policies
```

### 3. Configure Row Level Security

Execute `supabase/fix_rls.sql` for proper access policies.

### 4. (Optional) Seed Products

Execute `supabase/seed_products.sql` to add sample products.

### 5. Update Environment Variables

Add your Supabase credentials to `.env`.

---

## Database Schema

### Products Table

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Product name |
| price | numeric | Price in PKR |
| image | text | Image URL |
| category | text | Category (Women/Men/Kids) |
| fabric | text | Fabric type |
| length | text | Suit length |
| care | text | Care instructions |
| description | text | Product description |
| in_stock | boolean | Stock status |
| created_at | timestamp | Creation timestamp |

### Orders Table

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| customer_name | text | Customer name |
| customer_email | text | Customer email |
| customer_phone | text | Phone number |
| customer_address | text | Delivery address |
| customer_city | text | City |
| items | jsonb | Order items array |
| total | numeric | Order total |
| status | text | pending/delivered/not_delivered |
| created_at | timestamp | Order timestamp |

---

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

**Vercel Configuration** (vercel.json):
```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm ci --no-audit --no-fund",
  "framework": "vite",
  "outputDirectory": "dist"
}
```

### Building for Production

```bash
npm run build
```

The output will be in the `dist/` directory.

---

## Customization Guide

### Changing Site Name/Branding

1. **Title**: Edit `index.html` line 6
2. **Meta Description**: Edit `index.html` line 7
3. **Logo**: Modify `Navbar.jsx` component
4. **Colors**: Edit CSS variables in `src/styles.css`:

```css
:root {
  --primary: #8d6b4a;      /* Main brand color */
  --primary-deep: #755539; /* Darker variant */
  --bg: #f8f5f1;          /* Background */
  --text: #1f1a16;        /* Text color */
  --muted: #6d6258;       /* Muted text */
}
```

### Adding New Categories

1. Edit `src/data.js` - add to `categories` array
2. Products will automatically use new categories

### Adding New Pages

1. Create component in `src/pages/`
2. Import and add route in `src/App.jsx`:

```jsx
import MyNewPage from "./pages/MyNewPage";

// Add to Routes:
<Route path="/new-page" element={<MyNewPage />} />
```

### Modifying Product Fields

1. Update `src/context/ProductsContext.jsx` - `normalizeProduct` function
2. Update database schema in Supabase
3. Update admin form in `AdminDashboardPage.jsx`

### Adding Payment Integration

Currently orders are stored but no payment processing. To add:
1. Integrate a payment gateway (Stripe, JazzCash, EasyPaisa)
2. Modify `CheckoutPage.jsx`
3. Update order creation logic

### Changing Currency

1. Update price formatting in `ProductsContext.jsx`
2. Update display in cart/checkout components
3. Search for "Rs." in all files and replace

---

## Troubleshooting

### "Supabase is not configured" Error

Ensure your `.env` file has valid `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

### Images Not Loading

1. Check Supabase Storage bucket permissions
2. Verify bucket name matches `VITE_SUPABASE_PRODUCTS_BUCKET`
3. Check RLS policies allow public read access

### Admin Access Not Working

Add your email to `VITE_ADMIN_EMAILS` in `.env`:
```
VITE_ADMIN_EMAILS=your-email@gmail.com
```

### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Port Already in Use

```bash
npm run dev -- --port 3000
```

---

## SEO Configuration

The project includes:
- Semantic HTML
- Meta tags (description, keywords, author)
- Open Graph tags for social sharing
- Twitter Card tags
- JSON-LD structured data
- Sitemap (`public/sitemap.xml`)
- Robots.txt (`public/robots.txt`)

Update these in `index.html` for your domain.

---

## Performance Optimizations

- **Code Splitting**: Pages are lazy-loaded
- **Image Optimization**: Uses Unsplash CDN with WebP
- **Vendor Chunking**: React libraries are bundled separately
- **CSS Optimization**: Single CSS bundle
- **Font Preloading**: Google Fonts preconnected

---

## License

Private - All rights reserved

---

## Support

For issues or questions, review the codebase or contact the developer.
