# Catalog Cove App - Architecture Documentation

## 🎯 Project Overview

**Catalog Cove** is a modern product catalog management application built with Laravel 12 and React. It allows businesses to create and manage digital product catalogs with AI-powered features for generating product descriptions and titles.

## 🏗️ Technology Stack

### Backend
- **Framework**: Laravel 12 (PHP 8.2+)
- **Authentication**: Laravel Fortify & Sanctum
- **Database**: SQLite (configurable)
- **Image Storage**: Cloudinary
- **AI Integration**: OpenAI GPT-4o-mini
- **API Pattern**: Inertia.js (server-driven SPA)

### Frontend
- **Framework**: React 18 with TypeScript
- **UI Library**: Tailwind CSS v3 with @tailwindcss/forms
- **Components**: @headlessui/react
- **Icons**: lucide-react
- **Notifications**: Sonner
- **Theme**: next-themes (dark/light mode)
- **Build Tool**: Vite 7
- **Routing**: Inertia.js with Ziggy (Laravel routes in JS)

### Key Dependencies
- `cloudinary-labs/cloudinary-laravel` - Image upload and management
- `openai-php/laravel` - AI-powered product suggestions
- `inertiajs/inertia-laravel` - Seamless React/Laravel integration

## 📁 Project Structure

```
catalog-cove-app/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AISuggestionController.php    # AI-powered suggestions
│   │   │   ├── BusinessController.php        # Business management
│   │   │   ├── ProductController.php         # Product CRUD
│   │   │   ├── MediaLibraryController.php    # Image management
│   │   │   └── ProfileController.php         # User profile
│   │   ├── Middleware/                        # Custom middleware
│   │   └── Requests/                          # Form validation
│   ├── Models/
│   │   ├── User.php                           # User model
│   │   ├── Business.php                       # Business model
│   │   ├── Product.php                        # Product model
│   │   └── ProductImage.php                   # Product images
│   ├── Services/
│   │   └── CloudinaryService.php             # Cloudinary integration
│   └── Providers/                             # Service providers
├── resources/
│   ├── js/
│   │   ├── Components/                        # Reusable React components
│   │   ├── Contexts/                          # React contexts
│   │   ├── Hooks/                             # Custom React hooks
│   │   ├── Layouts/                           # Page layouts
│   │   ├── Pages/                             # Inertia pages
│   │   │   ├── Auth/                          # Authentication pages
│   │   │   ├── Business/                      # Business setup
│   │   │   ├── Products/                      # Product management
│   │   │   ├── MediaLibrary/                  # Media gallery
│   │   │   ├── Profile/                       # User profile
│   │   │   └── Dashboard.tsx                  # Main dashboard
│   │   └── app.tsx                            # React entry point
│   └── css/                                   # Styles
├── routes/
│   ├── web.php                                # Web routes
│   ├── auth.php                               # Auth routes
│   └── console.php                            # Console commands
├── database/
│   ├── migrations/                            # Database migrations
│   ├── factories/                             # Model factories
│   └── seeders/                               # Database seeders
└── tests/                                     # PHPUnit tests
```

## 🔑 Core Features

### 1. **Business Management**
- Each user can create and manage one business profile
- Business attributes: name, logo, email, WhatsApp, address, description
- Logo uploaded to Cloudinary (`cataladove/business/logos`)
- Middleware ensures users have a business before accessing products

### 2. **Product Catalog**
- Full CRUD operations for products
- Product attributes:
  - Name (auto-generates SEO-friendly slug)
  - Description
  - Price
  - Stock quantity
  - Multiple images support
- Image storage via Cloudinary
- Search and filter functionality
- Pagination (10 items per page)

### 3. **AI-Powered Features**
Integrated with OpenAI GPT-4o-mini for:
- **Product Title Generation**: Analyzes product images to suggest accurate, branded titles
- **Product Description**: Generates engaging descriptions (max 500 characters)
- Smart product identification including brand and model

### 4. **Media Library**
- Centralized image management
- Upload multiple images
- Delete images from Cloudinary
- Background removal feature (via Cloudinary AI)
- Image processing status tracking

### 5. **Authentication & Authorization**
- User registration and login (Laravel Fortify)
- Email verification
- Password reset
- Session-based authentication
- API token support (Sanctum)
- Role-based access (user role field)

## 🔄 Application Flow

### User Journey
1. **Registration/Login** → User creates an account
2. **Business Setup** → User creates their business profile (one-time)
3. **Dashboard Access** → Main hub for managing catalog
4. **Product Management**:
   - Create products with images
   - Use AI to generate titles/descriptions
   - Edit/update products
   - Delete products
5. **Media Library** → Manage all uploaded images

### Middleware Flow
```
Route Request
    ↓
Auth Middleware (check if logged in)
    ↓
No Business Middleware (for /business/create only)
    ↓
Business Exists Middleware (for protected routes)
    ↓
Controller Action
    ↓
Inertia Response (React page)
```

## 🗄️ Database Schema

### Users Table
- Standard Laravel users + `role` field

### Businesses Table
- `user_id` (foreign key)
- `name`, `email`, `whatsapp`
- `logo` (Cloudinary URL)
- `address`, `short_note`

### Products Table
- `business_id` (foreign key)
- `name`, `slug`, `description`
- `price`, `stock`
- Auto-generated slug on creation

### Product Images Table
- `product_id` (foreign key)
- Image URLs and metadata
- `is_processed` flag for background removal

## 🎨 Frontend Architecture

### Inertia.js Pattern
- Server-side routing with client-side rendering
- No need for separate API endpoints
- Share data from Laravel to React via props
- Automatic CSRF protection

### React Components
- TypeScript for type safety
- Functional components with hooks
- Responsive design with Tailwind CSS
- Dark/light theme support

### Key Pages
- **Dashboard**: Overview and quick actions
- **Products/Index**: Product list with search/pagination
- **Products/Create**: Multi-step product creation with AI
- **Products/Edit**: Update product details
- **MediaLibrary/Index**: Image gallery with management tools
- **Business/Create**: One-time business setup

## 🔌 API Integrations

### Cloudinary
- **Purpose**: Image hosting, transformation, and management
- **Features Used**:
  - Image upload with folder organization
  - Secure URLs
  - Background removal (AI-powered)
  - Image deletion
- **Folders**:
  - `cataladove/business/logos`
  - `ai_images` (temporary AI processing)
  - Product image folders

### OpenAI
- **Model**: gpt-4o-mini
- **Use Cases**:
  - Product title generation from images
  - Product description generation from images
- **Prompt Engineering**:
  - System role: Product listing assistant
  - Vision API for image analysis
  - Character limits enforced (500 for descriptions)

## 🚀 Development Setup

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 20+
- SQLite (or other DB)

### Environment Variables Required
```env
APP_KEY=              # Laravel app key
DB_CONNECTION=sqlite  # Database connection
CLOUDINARY_URL=       # Cloudinary credentials
OPENAI_API_KEY=       # OpenAI API key
```

### Scripts
```bash
# Install dependencies
composer install
npm install

# Development (runs all services concurrently)
composer dev
# Includes: Laravel server, queue worker, logs (Pail), Vite

# Build for production
npm run build

# Testing
composer test
php artisan test
```

## 🧪 Testing

- **Framework**: PHPUnit 11.5
- **Config**: `phpunit.xml`
- **Test Suite**: Located in `/tests` directory
- **Run**: `php artisan test` or `composer test`

## 🔒 Security Features

- CSRF protection (Laravel's built-in)
- SQL injection prevention (Eloquent ORM)
- XSS protection (React auto-escaping)
- Authentication via Sanctum
- File upload validation (size, type)
- API rate limiting (configurable)

## 📦 Build & Deployment

### Production Build
```bash
npm run build        # Compiles TypeScript + Vite
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Queue Management
- **Driver**: Database
- **Purpose**: Background job processing
- **Usage**: Image processing, AI requests

## 🎯 Key Design Decisions

1. **Inertia.js**: Chosen for simplified full-stack development without separate API
2. **SQLite**: Default for easy setup; scalable to PostgreSQL/MySQL
3. **Cloudinary**: External CDN for optimized image delivery
4. **TypeScript**: Type safety for frontend development
5. **Tailwind CSS**: Utility-first for rapid UI development
6. **Monolithic Architecture**: Single repository for easier development

## 🔮 Future Enhancements

Based on the codebase structure, potential additions:
- Multi-user business collaboration
- Product categories and tags
- Inventory management
- Order processing
- Analytics dashboard
- Bulk import/export
- API for external integrations
- Mobile app (React Native + Sanctum)

## 📝 Notes

- The repository contains a test file `cloudinary_test.php` with hardcoded credentials (should be removed in production)
- Application uses Laravel 12's latest features and conventions
- React components use modern patterns (hooks, context)
- Development environment uses concurrently to run multiple servers

---

**Last Updated**: October 2025
**Laravel Version**: 12.x
**PHP Version**: 8.2+
**React Version**: 18.2
