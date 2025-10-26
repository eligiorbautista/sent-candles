# Sent. Candles Website

## Overview

A modern, elegant, and responsive website for "Sent. Candles" - a local candle shop that showcases their handcrafted products and updates.

## Features Implemented

### Design & Styling

- **Color Scheme**: White, beige, and black for a modern, elegant look
- **Typography**:
  - Playfair Display (serif) for headings - elegant and sophisticated
  - Inter (sans-serif) for body text - clean and modern
- **Icons**: Lucide React icons throughout (replaced all emojis)
- **Animations**: Smooth fade-in and hover-lift effects
- **Responsive**: Fully responsive for desktop, laptop, tablet, and mobile devices

### Pages

#### 1. Home Page (`/`)

- **Hero Section**: Eye-catching hero with call-to-action buttons and stats
- **Featured Products**: Showcases 6 featured/bestseller candles
- **About Section**: Company story with 4 key features
- **Updates Section**: Latest news, events, and blog posts
- **Contact Section**: Contact form and contact information

#### 2. Products Page (`/products`)

- **Category Filtering**: Filter candles by 6 categories:
  - All Products
  - Signature Series
  - Botanical Collection
  - Seasonal Specials
  - Luxury Line
  - Wellness & Spa
- **Product Grid**: Displays all 15 candles with detailed information
- **Sticky Filter Bar**: Category buttons stay visible while scrolling
- **Product Details**: Each card shows:
  - Name and scent
  - Price and size
  - Burn time
  - Description
  - Key ingredients
  - Featured badge (if applicable)

### Components

1. **Header** - Sticky navigation with smooth routing
2. **Hero** - Main landing section with decorative elements
3. **Products** - Featured products showcase
4. **About** - Company story and features
5. **Updates** - News and events grid
6. **Contact** - Contact form and information
7. **Footer** - Links and social media

### Mock Data

- 15 products across 6 categories
- 6 news/update items
- All products include detailed information (ingredients, burn time, etc.)

### Technology Stack

- React 19.2.0
- React Router DOM (for navigation)
- Tailwind CSS 4.1.16 (for styling)
- Lucide React (for icons)
- Rsbuild (build tool)

### Color Palette

- White (#FFFFFF) - Main background
- Stone/Beige shades (50-800) - Accents and secondary backgrounds
- Black/Gray-900 (#111827) - Text and primary buttons
- Gradients for visual interest

### Next Steps (Future Implementation)

- Add admin panel for content management
- Connect to backend/database for real product data
- Add image upload functionality
- Implement actual contact form submission
- Add shopping cart (if converting to e-commerce)
- Add product detail pages
- Implement search functionality

## File Structure

```
src/
├── components/
│   ├── Header.jsx
│   ├── Hero.jsx
│   ├── Products.jsx
│   ├── About.jsx
│   ├── Updates.jsx
│   ├── Contact.jsx
│   └── Footer.jsx
├── pages/
│   ├── HomePage.jsx
│   └── ProductsPage.jsx
├── data/
│   └── productsData.js
├── App.jsx
├── App.css
└── index.jsx
```

## Running the Project

```bash
npm install
npm run dev
```

## Notes

- This is NOT an e-commerce site - it's for advertising and showcasing products
- All data is currently mock data
- Forms are not connected to any backend
- Images are placeholders (SVG icons)
