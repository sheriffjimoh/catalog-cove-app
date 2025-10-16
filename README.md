# Catalog Cove App 🛍️

> AI-powered product catalog management system built with Laravel 12 and React

[![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=flat&logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat&logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.2-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 📖 Quick Links

- **[Documentation Index](DOCS_INDEX.md)** - Guide to all documentation
- **[What Is This?](WHAT_IS_THIS.md)** - Simple explanation of what this app does
- **[Quick Reference](QUICK_REFERENCE.md)** - Commands and troubleshooting guide
- **[Architecture Documentation](ARCHITECTURE.md)** - Detailed technical documentation
- **[System Flow Diagrams](SYSTEM_FLOWS.md)** - Visual diagrams of how the system works
- **[Laravel Documentation](https://laravel.com/docs)** - Learn about Laravel
- **[React Documentation](https://react.dev)** - Learn about React

## 🎯 What Does This App Do?

**Catalog Cove** is a smart product catalog manager that helps businesses:

- 📦 Create and manage digital product catalogs
- 🤖 Use AI (OpenAI GPT-4) to generate product titles and descriptions from images
- 🖼️ Upload and manage product images via Cloudinary CDN
- 🏢 Set up business profiles with branding
- 🎨 Remove image backgrounds automatically
- 🔍 Search and organize products efficiently

Think of it as **"Shopify meets AI"** - focused purely on catalog management without the e-commerce complexity.

## ✨ Key Features

- **AI-Powered Content**: Generate product titles and descriptions from images using OpenAI
- **Cloud Image Storage**: Cloudinary integration for optimized image delivery
- **Modern Stack**: Laravel 12 + React 18 + TypeScript
- **No Separate API**: Inertia.js provides seamless full-stack development
- **Responsive Design**: Beautiful UI with Tailwind CSS and dark mode support
- **Type-Safe**: TypeScript for fewer bugs and better developer experience

## 🚀 Quick Start

### Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js 20+ and npm
- SQLite (or MySQL/PostgreSQL)

### Installation

```bash
# Clone the repository
git clone https://github.com/sheriffjimoh/catalog-cove-app.git
cd catalog-cove-app

# Install PHP dependencies
composer install

# Install JavaScript dependencies
npm install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Create SQLite database
touch database/database.sqlite

# Run migrations
php artisan migrate
```

### Configuration

Edit `.env` file and add your API keys:

```env
# Cloudinary (for image storage)
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# OpenAI (for AI features)
OPENAI_API_KEY=sk-your-openai-api-key
```

**Get your keys:**
- Cloudinary: [https://cloudinary.com/users/register_free](https://cloudinary.com/users/register_free)
- OpenAI: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)

### Running the Application

```bash
# Development mode (runs all services: server, queue, logs, vite)
composer dev
```

This single command starts:
- Laravel development server (http://localhost:8000)
- Queue worker (for background jobs)
- Laravel Pail (real-time logs)
- Vite dev server (for React hot-reload)

Alternatively, run services separately:

```bash
# Terminal 1: Laravel server
php artisan serve

# Terminal 2: Queue worker
php artisan queue:listen

# Terminal 3: Vite (React dev server)
npm run dev
```

### Building for Production

```bash
# Build frontend assets
npm run build

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 🧪 Testing

```bash
# Run all tests
composer test

# Or use PHPUnit directly
php artisan test
```

## 📁 Project Structure

```
catalog-cove-app/
├── app/                    # Laravel application code
│   ├── Http/
│   │   ├── Controllers/   # Request handlers
│   │   └── Middleware/    # Custom middleware
│   ├── Models/            # Database models
│   └── Services/          # Business logic (Cloudinary, etc.)
├── resources/
│   ├── js/                # React application
│   │   ├── Components/    # Reusable React components
│   │   ├── Pages/         # Inertia pages
│   │   └── Layouts/       # Page layouts
│   └── css/               # Stylesheets
├── routes/
│   ├── web.php           # Web routes
│   └── auth.php          # Authentication routes
├── database/
│   ├── migrations/       # Database schema
│   └── seeders/          # Seed data
└── tests/                # PHPUnit tests
```

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Laravel 12 (PHP 8.2+) |
| **Frontend** | React 18 + TypeScript |
| **Database** | SQLite / MySQL / PostgreSQL |
| **Styling** | Tailwind CSS 3 |
| **Build Tool** | Vite 7 |
| **Image Storage** | Cloudinary |
| **AI** | OpenAI GPT-4o-mini |
| **Authentication** | Laravel Fortify + Sanctum |
| **SPA Integration** | Inertia.js |

## 📚 Documentation

- **[DOCS_INDEX.md](DOCS_INDEX.md)** - Navigation guide to all documentation
- **[WHAT_IS_THIS.md](WHAT_IS_THIS.md)** - High-level overview for beginners
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Commands and troubleshooting
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Detailed technical architecture
- **[SYSTEM_FLOWS.md](SYSTEM_FLOWS.md)** - Visual diagrams and flow charts
- **[Laravel Docs](https://laravel.com/docs)** - Framework documentation
- **[Inertia.js Docs](https://inertiajs.com)** - SPA integration guide

## 🔐 Security

- ✅ CSRF protection enabled
- ✅ Input validation on all forms
- ✅ SQL injection prevention via Eloquent ORM
- ✅ XSS protection via React auto-escaping
- ✅ File upload validation (type, size limits)

**⚠️ Security Note**: Remove `cloudinary_test.php` before deploying to production (contains test credentials).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## 👤 Author

**Sheriff Jimoh** - [GitHub Profile](https://github.com/sheriffjimoh)

## 🙏 Acknowledgments

Built with these amazing technologies:
- [Laravel](https://laravel.com) - The PHP Framework for Web Artisans
- [React](https://reactjs.org) - A JavaScript library for building user interfaces
- [Inertia.js](https://inertiajs.com) - Build single-page apps without building an API
- [Tailwind CSS](https://tailwindcss.com) - A utility-first CSS framework
- [Cloudinary](https://cloudinary.com) - Image and video management in the cloud
- [OpenAI](https://openai.com) - AI-powered content generation

---

**Need Help?** 
- 📖 [WHAT_IS_THIS.md](WHAT_IS_THIS.md) - Simple explanation
- 🚀 [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Commands & troubleshooting
- 🏗️ [ARCHITECTURE.md](ARCHITECTURE.md) - Technical details
- 🔄 [SYSTEM_FLOWS.md](SYSTEM_FLOWS.md) - Visual diagrams
