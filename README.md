# Article Manager

Modern article management tool built with **SvelteKit**, **TypeScript**, and **Tailwind CSS**.

## ✨ Features

- **📋 Article Management** - Create, edit, delete, and view articles
- **🔍 Search & Filter** - Real-time search with status filtering
- **📱 Responsive Design** - Works on desktop and mobile
- **🌙 Dark Mode** - Light/dark theme toggle
- **👤 Role-Based Access** - Editor vs Viewer permissions
- **♾️ Infinite Scroll** - Smooth pagination experience
- **🗃️ Airtable Integration** - Real database storage

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 🔧 Configuration

### Local Development (Mock Data)

```bash
# .env
USE_MOCK_API=true
```

### Production (Airtable)

```bash
# .env
USE_MOCK_API=false
API_BASE_URL=https://api.airtable.com/v0
AIRTABLE_BASE_ID=your_base_id
AIRTABLE_TABLE_ID=your_table_id
AIRTABLE_API_KEY=your_api_key
```

### Airtable Setup

Create a table with these fields:

- `Title` (Single line text)
- `Status` (Single select: Published, Draft)
- `Author` (Single line text)
- `CreatedAt` (Date & time)

## 🏗️ Tech Stack

- **Frontend**: SvelteKit 2 + Svelte 5 (Runes)
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Database**: Airtable (production) / Mock data (development)
- **Testing**: Vitest + Playwright
- **Deployment**: GitHub Pages

## 📁 Project Structure

```
src/
├── lib/
│   ├── components/     # Reusable UI components
│   ├── api/           # API services (Mock + Airtable)
│   ├── stores/        # State management
│   └── utils/         # Helper functions
├── routes/
│   ├── api/           # SvelteKit API routes
│   └── +page.svelte   # Main application
└── tests/             # Unit and E2E tests
```

## 🧪 Testing

- **Unit Tests**: `npm run test:unit`
- **E2E Tests**: `npm run test:e2e`
- **Coverage**: `npm run test:coverage`

## 🚀 Deployment

Automatically deploys to GitHub Pages on push to `main` branch with:

- ✅ Automated testing
- ✅ Security scanning
- ✅ Performance monitoring
- ✅ Accessibility validation

---

**Live Demo**: [View Application](https://aarumugamtce.github.io/article-management/)

Built with ❤️ using modern web technologies
