# Article Manager

Internal tool for managing articles built with **SvelteKit (Svelte 5 with Runes)**, **TypeScript**, and **Tailwind CSS**. Features paginated list, search/filter, CRUD operations, validation, accessibility, performance optimizations, and bonus features (role-based access, theme toggle, infinite scroll).

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
├─────────────────────────────────────────────────────────────┤
│  +page.svelte (Main App)                                    │
│  ├── ArticleCard.svelte                                     │
│  ├── ArticleForm.svelte                                     │
│  ├── Modal.svelte                                           │
│  ├── Input.svelte                                           │
│  ├── Select.svelte                                          │
│  └── Button.svelte                                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     STATE MANAGEMENT                        │
├─────────────────────────────────────────────────────────────┤
│  Svelte 5 Runes ($state, $effect, $derived)                 │
│  ├── articles.ts (Data Store)                               │
│  ├── theme.ts (Theme Store)                                 │
│  └── role.ts (Role Store)                                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER                            │
├─────────────────────────────────────────────────────────────┤
│  API Service (articles.ts)                                  │
│  ├── ArticleAPI (Mock/SvelteKit)                            │
│  └── ExternalArticleAPI (Real Backend)                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER                              │
├─────────────────────────────────────────────────────────────┤
│  SvelteKit API Routes (Mock)                                │
│  └── /api/articles/+server.ts                               │
│      ├── GET (Read with pagination/search/filter)           │
│      ├── POST (Create)                                      │
│      ├── PUT (Update)                                       │
│      └── DELETE (Delete)                                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     DATA LAYER                              │
├─────────────────────────────────────────────────────────────┤
│  In-Memory Mock Data (100 sample articles)                  │
│  └── Article Schema: { id, title, status, author, date }    │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Features Implemented

### ✅ Core Requirements

- **📋 Article List**: Paginated view with infinite scroll
- **🔍 Search**: Debounced search by title (300ms)
- **🏷️ Filter**: Status filter (All, Published, Draft)
- **➕ CRUD Operations**: Create, Read, Update, Delete articles
- **✅ Form Validation**: Required field validation
- **📱 Modal Interface**: Add/Edit articles in modal
- **⚡ Performance**: Debouncing, lazy loading, intersection observer

### ✅ Accessibility & UX

- **♿ Semantic HTML**: Proper ARIA labels and roles
- **⌨️ Keyboard Navigation**: Full keyboard accessibility
- **📢 Screen Reader**: ARIA live regions for dynamic content
- **🎯 Focus Management**: Proper focus handling in modals
- **🔄 Loading States**: Visual feedback for async operations
- **❌ Error Handling**: User-friendly error messages

### ✅ Bonus Features

- **👤 Role-Based Access**: Editor vs Viewer permissions
- **🌙 Theme Toggle**: Light/Dark mode with smooth transitions
- **♾️ Infinite Scroll**: Intersection Observer API implementation
- **📊 Real-time Stats**: Article count and pagination info

## 🛠️ Technical Implementation

### **Frontend Architecture**

```typescript
// Svelte 5 Runes Pattern
let articles = $state<Article[]>([]);
let loading = $state(false);
let currentTheme = $derived(getTheme());

$effect(() => {
	// Reactive side effects
	document.documentElement.classList.toggle('dark', currentTheme === 'dark');
});
```

### **State Management**

- **Svelte 5 Runes**: Modern reactive state (`$state`, `$effect`, `$derived`)
- **Writable Stores**: Theme and role persistence
- **Local State**: Component-level state management

### **API Design**

```typescript
// Service Layer Pattern
import { articleAPI } from '$lib/api/articles';

// Fetch articles with filters
const data = await articleAPI.getArticles({
	page: 1,
	limit: 10,
	search: 'term',
	status: 'Published'
});

// CRUD operations
await articleAPI.createArticle(newArticle);
await articleAPI.updateArticle(id, updatedArticle);
await articleAPI.deleteArticle(id);
```

### **Backend Integration**

```typescript
// Easy switch between mock and real API
const USE_MOCK_API = false; // Set to false for production
const BACKEND_URL = 'https://your-api.com';

// Real API with authentication
class ExternalArticleAPI {
	async getArticles(filters) {
		return fetch(`${baseUrl}/articles`, {
			headers: { Authorization: `Bearer ${token}` }
		});
	}
}
```

### **Component Architecture**

```
src/lib/
├── api/
│   └── articles.ts           # API service layer
├── components/
│   ├── ArticleCard.svelte    # Article display component
│   ├── ArticleForm.svelte    # Form with validation
│   ├── Modal.svelte          # Accessible modal dialog
│   ├── Input.svelte          # Debounced input field
│   ├── Select.svelte         # Dropdown component
│   └── Button.svelte         # Reusable button component
├── config/
│   └── env.ts                # Environment configuration
├── constants/
│   └── index.ts              # Application constants
├── stores/
│   ├── articles.ts           # Mock data store
│   ├── theme.ts              # Theme management
│   └── role.ts               # Role management
├── types/
│   └── index.ts              # TypeScript definitions
└── utils/
    ├── cache.ts              # API response caching
    ├── debounce.ts           # Utility functions
    ├── errorHandler.ts       # Centralized error handling
    ├── logger.ts             # Structured logging
    ├── performance.ts        # Performance monitoring
    └── validation.ts         # Form validation
```

### **Performance Optimizations**

- **Debouncing**: 300ms search delay
- **Intersection Observer**: Efficient infinite scroll
- **Lazy Loading**: Load articles on demand
- **Memory Management**: Proper cleanup of observers
- **CSS Transitions**: Smooth theme switching
- **API Caching**: TTL-based response caching
- **Performance Monitoring**: Execution time tracking
- **Throttling**: Rate limiting for expensive operations

## 🧪 Testing Strategy

### **Unit Tests** (Vitest)

```bash
tests/unit/
├── utils/
│   ├── debounce.test.ts          # Debounce utility tests
│   └── validation.test.ts        # Form validation tests
└── stores/
    └── articles.test.ts          # Article store logic tests
```

### **Code Coverage** (Vitest + V8)

```bash
# Coverage Thresholds (Quality Gates)
- Lines: 80% minimum
- Branches: 80% minimum
- Functions: 80% minimum
- Statements: 80% minimum

# Reports Generated
- HTML: coverage/index.html
- LCOV: coverage/lcov.info
- JSON: coverage/coverage.json
```

### **Integration Tests** (Playwright)

```bash
e2e/
└── demo.test.ts                  # End-to-end user flows
    ├── Article CRUD operations
    ├── Search and filtering
    ├── Theme switching
    ├── Role-based access
    └── Accessibility compliance
```

### **Accessibility Tests** (axe-core)

```bash
# Automated WCAG 2.1 AA compliance testing
- Color contrast validation
- Keyboard navigation testing
- Screen reader compatibility
- ARIA attributes validation
- Focus management verification
```

## 🎨 Styling & Theming

### **Tailwind CSS v4**

- **Dark Mode**: Class-based theme switching
- **Responsive Design**: Mobile-first approach
- **Custom Properties**: CSS variables for theming
- **Component Variants**: Consistent design system

### **Theme Implementation**

```css
/* Light Mode */
body {
	background-color: white;
	color: #111827;
}

/* Dark Mode */
.dark body {
	background-color: #111827;
	color: #f9fafb;
}
```

## 📁 Project Structure

```
article-management/
├── src/
│   ├── lib/
│   │   ├── api/                # API service layer
│   │   │   └── articles.ts     # Article API service
│   │   ├── components/         # Reusable UI components
│   │   ├── config/             # Configuration management
│   │   │   └── env.ts          # Environment variables
│   │   ├── constants/          # Application constants
│   │   │   └── index.ts        # Centralized constants
│   │   ├── stores/             # State management
│   │   ├── types/              # TypeScript definitions
│   │   └── utils/              # Utility functions
│   │       ├── cache.ts        # API caching layer
│   │       ├── errorHandler.ts # Error management
│   │       ├── logger.ts       # Structured logging
│   │       └── performance.ts  # Performance utilities
│   ├── routes/
│   │   ├── api/articles/       # Mock API endpoints
│   │   └── +page.svelte        # Main application
│   └── app.css                 # Global styles
├── tests/
│   └── unit/                   # Unit tests organized by feature
│       ├── components/         # Component tests
│       ├── stores/             # Store tests
│       └── utils/              # Utility tests
├── e2e/                        # End-to-end tests
└── static/                     # Static assets
```

## 🚦 Getting Started

### **Prerequisites**

- Node.js 18+
- npm or pnpm

### **Installation**

```bash
npm install
```

### **Development**

```bash
npm run dev
# or start with browser
npm run dev -- --open
```

### **Testing**

```bash
# Unit tests
npm run test:unit

# Unit tests with coverage
npm run test:coverage

# E2E tests
npm run test:e2e

# Accessibility tests
npm run test:a11y

# All tests
npm test
```

### **Production Build**

```bash
npm run build
npm run preview
```

### **Pre-commit Hooks**

```bash
# Automatically runs on git commit:
- Prettier formatting
- TypeScript checking
- Only on staged files
```

## 🚀 Deployment

### **GitHub Pages with CI/CD**

Automated deployment pipeline with comprehensive testing:

```yaml
# .github/workflows/deploy.yml
- Unit Tests (Vitest) with Code Coverage
- E2E Tests (Playwright)
- Accessibility Testing (axe-core)
- Security Audit (npm audit)
- Vulnerability Scan (Snyk)
- Lighthouse Performance Testing
- Coverage Upload (Codecov)
- Automated GitHub Pages Deployment
```

### **Quality Gates**

- **Performance**: 75+ Lighthouse score
- **Accessibility**: 98+ Lighthouse score + axe-core compliance
- **Security**: No high/critical vulnerabilities
- **Code Coverage**: 80% minimum (lines, branches, functions, statements)
- **Tests**: 100% test suite passing

### **Setup Instructions**

1. Fork this repository
2. Enable GitHub Pages in repository settings
3. Add `SNYK_TOKEN` secret for vulnerability scanning
4. Push to `main` branch triggers deploymentiew

```

## 🔧 Configuration

### **Environment Setup**
- **TypeScript**: Strict mode enabled
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Tailwind**: Utility-first CSS
- **Vite**: Fast build tool
- **Husky**: Pre-commit hooks
- **lint-staged**: Staged file linting
- **GitHub Actions**: CI/CD pipeline
- **Lighthouse CI**: Performance monitoring
- **Snyk**: Security vulnerability scanning

### **Browser Support**
- Modern browsers with ES2022 support
- Chrome 91+, Firefox 90+, Safari 14+

### **Security & Performance**
- **Automated security audits** on every commit
- **Lighthouse performance testing** with quality gates
- **Dependency vulnerability scanning** with Snyk
- **Zero-downtime deployments** via GitHub Pages

## 📊 Performance Metrics

- **Bundle Size**: Optimized with Vite
- **First Load**: < 100KB gzipped
- **Lighthouse Score**: 75+ Performance, 95+ Accessibility & SEO
- **Memory Usage**: Efficient with proper cleanup

## 🎯 Interview Highlights

### **Technical Decisions**
1. **Svelte 5 Runes**: Chose cutting-edge reactive system
2. **Service Layer Pattern**: Clean API abstraction for backend integration
3. **TypeScript**: Full type safety throughout
4. **Component Architecture**: Reusable, testable components
5. **Accessibility First**: WCAG 2.1 AA compliance
6. **Mock-to-Production**: Seamless transition from development to production
7. **Enterprise Patterns**: Error boundaries, structured logging, performance monitoring
8. **Configuration Management**: Environment-based configuration with type safety

### **AI-Assisted Development**
- Leveraged AI for rapid prototyping
- Maintained code quality standards
- Implemented industry best practices
- Created comprehensive test coverage

### **Production Considerations**
- **API Service Layer**: Easy backend integration
- **Authentication Ready**: Built-in token management
- **Error Handling**: Centralized error management with custom error types
- **Type Safety**: Full TypeScript coverage for API contracts
- **Environment Configuration**: Type-safe environment variable management
- **Performance Monitoring**: Built-in execution time tracking and caching
- **Structured Logging**: Configurable log levels and structured output
- **CI/CD Pipeline**: Automated testing, security scanning, and deployment
- **Security Scanning**: Automated vulnerability detection with Snyk
- **Memory Management**: Efficient caching with TTL and cleanup

---

**Built with ❤️ using Svelte 5, TypeScript, and modern web standards**
```
