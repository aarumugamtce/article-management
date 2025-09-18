# Article Management System

Enterprise-grade article management application built with **SvelteKit 2**, **TypeScript**, and **Tailwind CSS v4**.

## 🎯 Overview

A modern, scalable article management system demonstrating advanced frontend architecture, state management, and user experience design. Features role-based access control, real-time search, infinite scrolling, and seamless theme switching with persistent user preferences.

## ✨ Features

### Functional Features

- **📋 CRUD Operations** - Complete article lifecycle management (Create, Read, Update, Delete)
- **🔍 Real-time Search** - Instant search with debounced input and status filtering
- **👤 Role-Based Access Control** - Dynamic UI based on Editor/Viewer permissions
- **♾️ Infinite Scroll** - Performance-optimized pagination with virtual scrolling
- **🗃️ Dual Data Sources** - Seamless switching between Airtable API and mock data
- **📱 Cross-Platform Compatibility** - Responsive design for desktop, tablet, and mobile

### Non-Functional Features

- **🌙 Theme System** - Light/dark mode with system preference detection
- **💾 Persistent Storage** - LocalStorage integration for user preferences
- **⚡ Performance Optimization** - Lazy loading, code splitting, and efficient re-renders
- **🔒 Security** - Input sanitization, XSS protection, and secure API handling
- **♿ Accessibility** - WCAG 2.1 AA compliance with screen reader support
- **🧪 Quality Assurance** - Comprehensive testing suite (Unit, E2E, Accessibility)

## 🏗️ Architecture & Tech Stack

### Frontend Framework

- **SvelteKit 2** - Full-stack framework with SSR/SPA capabilities
- **Svelte 5 (Runes)** - Latest reactive paradigm for optimal performance
- **TypeScript** - Type-safe development with strict configuration

### Styling & UI

- **Tailwind CSS v4** - Utility-first CSS with custom design system
- **Responsive Design** - Mobile-first approach with breakpoint optimization
- **Custom Components** - Reusable UI library with consistent theming

### State Management

- **Custom Stores** - Lightweight reactive state with localStorage persistence
- **API Layer** - Abstracted data services with error handling
- **Type Safety** - End-to-end TypeScript coverage

### Testing & Quality

- **Vitest** - Unit testing with coverage reporting
- **Playwright** - End-to-end browser testing
- **Axe Core** - Automated accessibility testing
- **Google Lighthouse** - Performance and quality auditing
- **Snyk** - Vulnerability scanning and dependency monitoring
- **ESLint + Prettier** - Code quality and formatting
- **Husky + Lint-staged** - Pre-commit hooks

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Run all tests
npm test

# Build for production
npm run build
```

## 🔧 Configuration

### GitHub Pages (Default)

```bash
# .env
NODE_ENV=production
USE_MOCK_API=true
```

### Airtable Integration (Optional)

```bash
# .env
USE_MOCK_API=false
API_BASE_URL=https://api.airtable.com/v0
AIRTABLE_BASE_ID=your_base_id
AIRTABLE_TABLE_ID=your_table_id
AIRTABLE_API_KEY=your_api_key
```

### Airtable Schema

```
Fields:
├── Title (Single line text)
├── Status (Single select: Published, Draft)
├── Author (Single line text)
└── CreatedAt (Date & time)
```

## 📁 Project Structure

```
src/
├── lib/
│   ├── components/        # Reusable UI components
│   │   ├── ArticleCard.svelte
│   │   ├── ArticleForm.svelte
│   │   └── ui/           # Base UI components
│   ├── api/              # Data layer
│   │   ├── articles.ts   # API client
│   │   └── mock.ts       # Mock data service
│   ├── stores/           # State management
│   │   ├── articles.ts   # Article state
│   │   ├── theme.ts      # Theme preferences
│   │   └── role.ts       # User role management
│   ├── utils/            # Helper functions
│   │   ├── debounce.ts   # Performance utilities
│   │   ├── sanitize.ts   # Security utilities
│   │   └── validation.ts # Form validation
│   ├── constants/        # Application constants
│   ├── types/            # TypeScript definitions
│   └── data/             # Static data
├── routes/
│   ├── api/              # Server-side API routes
│   └── +page.svelte      # Main application
└── tests/                # Test suites
    ├── unit/             # Unit tests
    └── e2e/              # End-to-end tests
```

## 🧪 Testing Strategy

```bash
# Unit tests with coverage
npm run test:unit
npm run test:coverage

# End-to-end testing
npm run test:e2e

# Accessibility testing
npm run test:a11y

# Performance auditing
lighthouse http://localhost:4173

# Security vulnerability scanning
snyk test
snyk monitor

# Code quality
npm run lint
npm run check
```

## 🚀 Deployment Pipeline

**GitHub Actions Workflow:**

- ✅ Automated testing (Unit + E2E)
- ✅ Code quality checks (ESLint + TypeScript)
- ✅ Security vulnerability scanning (Snyk)
- ✅ Accessibility validation (Axe Core)
- ✅ Performance monitoring (Lighthouse)
- ✅ Automated deployment to GitHub Pages

## 🎨 Design System

- **Typography**: System font stack with fallbacks
- **Color Palette**: Semantic color tokens for light/dark themes
- **Spacing**: Consistent 8px grid system
- **Components**: Atomic design methodology
- **Accessibility**: Focus management and ARIA compliance

## 📊 Performance Metrics

- **Lighthouse Score**: 95+ across all categories
- **Bundle Size**: Optimized with code splitting
- **Runtime Performance**: 60fps animations and interactions
- **Accessibility**: WCAG 2.1 AA compliant

---

**Live Demo**: [View Application](https://aarumugamtce.github.io/article-management/)

Built by **Arumugam** with modern web technologies and best practices.
