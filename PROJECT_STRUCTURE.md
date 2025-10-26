# Project Structure

## Overview

This is a React-based website for Sent. Candles, built with Rsbuild and organized with a clear component structure.

## Directory Structure

```
src/
├── components/
│   ├── common/              # Reusable UI components
│   │   ├── AnimatedCounter.jsx
│   │   ├── BackToTop.jsx
│   │   ├── Toast.jsx
│   │   ├── WaveDivider.jsx
│   │   └── index.js         # Barrel exports
│   │
│   ├── layout/              # Layout components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── index.js
│   │
│   ├── sections/            # Page sections/features
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Products.jsx
│   │   ├── Events.jsx
│   │   ├── Contact.jsx
│   │   └── index.js
│   │
│   └── modals/              # Modal dialogs
│       ├── ProductModal.jsx
│       ├── EventModal.jsx
│       └── index.js
│
├── pages/                   # Page components
│   ├── HomePage.jsx
│   └── ProductsPage.jsx
│
├── data/                    # Data and content
│   ├── aboutData.js
│   ├── assetsData.js
│   ├── contactData.js
│   ├── eventsData.js
│   ├── heroData.js
│   ├── productsData.js
│   └── siteData.js
│
├── hooks/                   # Custom React hooks
│   └── useScrollAnimation.js
│
├── styles/                  # CSS files
│   └── App.css
│
├── App.jsx                  # Main App component
└── index.jsx               # Entry point

public/                      # Static assets
└── favicon.jpg

```

## Component Categories

### 1. Common Components (`components/common/`)

Reusable UI components used across the application:

- **AnimatedCounter**: Animated number counter
- **BackToTop**: Scroll to top button
- **Toast**: Notification toasts
- **WaveDivider**: SVG wave divider

### 2. Layout Components (`components/layout/`)

Structural layout components:

- **Header**: Navigation bar with mobile menu
- **Footer**: Site footer with links and contact info

### 3. Section Components (`components/sections/`)

Major page sections/features:

- **Hero**: Landing page hero section
- **About**: About us section
- **Products**: Product showcase section
- **Events**: Events/updates section
- **Contact**: Contact form and info

### 4. Modal Components (`components/modals/`)

Modal dialogs and overlays:

- **ProductModal**: Product detail modal
- **EventModal**: Event detail modal

### 5. Pages (`pages/`)

Full page components:

- **HomePage**: Main landing page
- **ProductsPage**: Products catalog page

## Import Patterns

### Using Barrel Exports

Components can be imported individually or as a group:

```javascript
// Individual import
import Header from './components/layout/Header';

// Group import (recommended)
import { Header, Footer } from './components/layout';
```

### Import Paths

- From pages: `../../` to reach data/hooks
- From sections: `../../` to reach data/hooks
- From modals: `../../` to reach data
- From layout: `../../` to reach data

## Best Practices

1. **Component Organization**: Place components in the appropriate folder based on their purpose
2. **Data Separation**: Keep data in separate files in the `data/` folder
3. **Hooks**: Custom hooks go in the `hooks/` folder
4. **Styles**: Global styles in `styles/` folder
5. **Barrel Exports**: Use index.js files for cleaner imports

## Adding New Components

1. Create the component file in the appropriate folder
2. Update the corresponding `index.js` with an export
3. Import using the barrel export pattern

Example:

```javascript
// 1. Create: components/common/NewComponent.jsx
// 2. Add to: components/common/index.js
export { default as NewComponent } from './NewComponent';

// 3. Use:
import { NewComponent } from './components/common';
```
