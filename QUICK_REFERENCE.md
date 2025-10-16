# Quick Reference Guide 🚀

> Essential commands and information for working with Catalog Cove

## 📋 Table of Contents

1. [Development Commands](#development-commands)
2. [File Locations](#file-locations)
3. [Database Operations](#database-operations)
4. [API Endpoints](#api-endpoints)
5. [Troubleshooting](#troubleshooting)
6. [Environment Variables](#environment-variables)

---

## Development Commands

### Initial Setup
```bash
# Clone and install
git clone https://github.com/sheriffjimoh/catalog-cove-app.git
cd catalog-cove-app
composer install
npm install

# Setup environment
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
```

### Running the App

```bash
# Start everything at once (RECOMMENDED)
composer dev

# Or run separately:
php artisan serve              # Laravel server (port 8000)
php artisan queue:listen       # Queue worker
php artisan pail               # Real-time logs
npm run dev                    # Vite dev server
```

### Building for Production
```bash
npm run build                         # Compile assets
composer install --no-dev             # Production dependencies only
php artisan config:cache              # Cache config
php artisan route:cache               # Cache routes
php artisan view:cache                # Cache views
```

### Testing
```bash
composer test                  # Run all tests
php artisan test              # Alternative way
php artisan test --filter=ProductTest  # Run specific test
```

### Database Commands
```bash
php artisan migrate                   # Run migrations
php artisan migrate:fresh            # Drop all tables and re-migrate
php artisan migrate:rollback         # Rollback last migration
php artisan migrate:status           # Check migration status
php artisan db:seed                  # Run seeders
php artisan migrate:fresh --seed    # Fresh DB with seed data
```

### Cache Management
```bash
php artisan cache:clear          # Clear application cache
php artisan config:clear         # Clear config cache
php artisan route:clear          # Clear route cache
php artisan view:clear           # Clear compiled views
php artisan optimize:clear       # Clear all caches
```

### Code Quality
```bash
./vendor/bin/pint               # Format PHP code (Laravel Pint)
npm run build                   # TypeScript type checking + build
```

---

## File Locations

### Backend (Laravel)
```
app/
├── Http/Controllers/
│   ├── ProductController.php       # Product CRUD
│   ├── BusinessController.php      # Business management
│   ├── AISuggestionController.php  # AI features
│   └── MediaLibraryController.php  # Image management
├── Models/
│   ├── User.php                    # User model
│   ├── Business.php                # Business model
│   ├── Product.php                 # Product model
│   └── ProductImage.php            # Product images
├── Services/
│   └── CloudinaryService.php       # Cloudinary integration
└── Http/Middleware/
    ├── BusinessExists.php          # Check if user has business
    └── NoBusiness.php              # Prevent duplicate business
```

### Frontend (React)
```
resources/js/
├── Pages/
│   ├── Dashboard.tsx               # Main dashboard
│   ├── Products/
│   │   ├── Index.tsx              # Product list
│   │   ├── Create.tsx             # Create product
│   │   └── Edit.tsx               # Edit product
│   ├── Business/
│   │   └── Create.tsx             # Business setup
│   ├── MediaLibrary/
│   │   └── Index.tsx              # Image gallery
│   └── Auth/                      # Auth pages
├── Components/                     # Reusable components
├── Layouts/                       # Page layouts
└── app.tsx                        # React entry point
```

### Configuration
```
.env                    # Environment variables
config/                # Laravel config files
routes/web.php         # Application routes
database/migrations/   # Database schema
phpunit.xml           # Test configuration
tsconfig.json         # TypeScript config
tailwind.config.js    # Tailwind CSS config
vite.config.js        # Vite build config
```

---

## Database Operations

### Tables
```
users              # User accounts
businesses         # Business profiles
products          # Products
product_images    # Product images
cache             # Application cache
sessions          # User sessions
jobs              # Queue jobs
```

### Common Queries (via Tinker)
```bash
php artisan tinker

# Get all users
User::all();

# Get user with business
User::with('business')->find(1);

# Get products with images
Product::with('images')->get();

# Count products
Product::count();

# Get latest products
Product::orderBy('created_at', 'desc')->take(5)->get();
```

---

## API Endpoints

### Web Routes (routes/web.php)

#### Public Routes
```
GET  /                    # Home (redirects to login or dashboard)
```

#### Authentication (routes/auth.php)
```
GET  /login              # Login page
POST /login              # Login action
POST /logout             # Logout
GET  /register           # Register page
POST /register           # Register action
GET  /forgot-password    # Password reset request
POST /forgot-password    # Send reset link
GET  /reset-password     # Reset password form
POST /reset-password     # Update password
```

#### Business Routes
```
GET  /business/create    # Create business form
POST /business           # Store business
```

#### Product Routes
```
GET    /products              # List products
GET    /products/create       # Create product form
POST   /products              # Store product
GET    /products/{id}/edit    # Edit product form
PUT    /products/{id}         # Update product
DELETE /products/{id}         # Delete product
```

#### Media Library
```
GET    /media-library         # Image gallery
DELETE /image/delete/{id}     # Delete image
POST   /image/remove-bg       # Remove background
```

#### AI Features
```
POST /ai/suggestion          # Generate AI suggestions
     Required params:
     - image: file or image_url: string
     - type: "title" | "description"
```

#### Profile
```
GET    /profile              # Edit profile page
PATCH  /profile              # Update profile
DELETE /profile              # Delete account
```

---

## Troubleshooting

### Common Issues

**Issue: "Class 'Redis' not found"**
```bash
# Change CACHE_STORE in .env
CACHE_STORE=database
```

**Issue: "No application encryption key"**
```bash
php artisan key:generate
```

**Issue: "Database not found"**
```bash
touch database/database.sqlite
php artisan migrate
```

**Issue: "Vite manifest not found"**
```bash
npm install
npm run build
```

**Issue: "Queue not processing"**
```bash
# Check queue connection in .env
QUEUE_CONNECTION=database

# Run queue worker
php artisan queue:listen
```

**Issue: "Cloudinary upload failed"**
```bash
# Check .env has correct format
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
```

**Issue: "OpenAI API error"**
```bash
# Verify API key in .env
OPENAI_API_KEY=sk-your-key-here

# Check API key validity at:
# https://platform.openai.com/api-keys
```

**Issue: "Permission denied on storage"**
```bash
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

**Issue: "TypeScript errors"**
```bash
npm install
npm run build  # Check for type errors
```

### Debug Mode

Enable detailed errors in `.env`:
```env
APP_DEBUG=true
LOG_LEVEL=debug
```

View logs:
```bash
php artisan pail           # Real-time logs
tail -f storage/logs/laravel.log  # Log file
```

---

## Environment Variables

### Required Variables

```env
# Application
APP_NAME=CatalogCove
APP_ENV=local
APP_KEY=base64:...           # Generate with: php artisan key:generate
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database (SQLite)
DB_CONNECTION=sqlite

# OR MySQL/PostgreSQL
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=catalog_cove
# DB_USERNAME=root
# DB_PASSWORD=

# Queue & Cache
QUEUE_CONNECTION=database
CACHE_STORE=database
SESSION_DRIVER=database

# Cloudinary (Image Storage)
CLOUDINARY_URL=cloudinary://KEY:SECRET@CLOUD_NAME
# Get from: https://cloudinary.com/console

# OpenAI (AI Features)
OPENAI_API_KEY=sk-proj-...
# Get from: https://platform.openai.com/api-keys
```

### Optional Variables

```env
# Mail (for password reset)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your-username
MAIL_PASSWORD=your-password
MAIL_FROM_ADDRESS=noreply@catalogcove.com

# Broadcasting (for real-time features)
BROADCAST_CONNECTION=log

# Logging
LOG_CHANNEL=stack
LOG_LEVEL=debug
```

---

## Quick Tips

### Development Workflow
1. Make changes to code
2. Check browser (Vite hot-reloads React)
3. Check Laravel logs: `php artisan pail`
4. Test functionality
5. Commit changes

### Adding a New Feature
1. Create migration: `php artisan make:migration create_table_name`
2. Create model: `php artisan make:model ModelName`
3. Create controller: `php artisan make:controller NameController`
4. Add routes in `routes/web.php`
5. Create React page in `resources/js/Pages/`
6. Test locally
7. Write tests in `tests/`

### Useful Laravel Artisan Commands
```bash
php artisan list                    # List all commands
php artisan route:list             # List all routes
php artisan make:controller Name   # Create controller
php artisan make:model Name        # Create model
php artisan make:migration name    # Create migration
php artisan make:middleware Name   # Create middleware
php artisan make:request Name      # Create form request
php artisan make:test NameTest     # Create test
```

### Useful NPM Scripts
```bash
npm run dev        # Start Vite dev server
npm run build      # Build for production
npm run preview    # Preview production build
```

---

## Performance Tips

### Production Optimization
```bash
# Cache everything
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Optimize autoloader
composer install --optimize-autoloader --no-dev

# Build assets
npm run build
```

### Database Optimization
```bash
# Add indexes to frequently queried columns
# In migration:
$table->index('column_name');

# Eager load relationships
Product::with('images', 'business')->get();

# Use pagination
Product::paginate(10);
```

---

## Security Checklist

- [ ] Remove `cloudinary_test.php` before production
- [ ] Set `APP_DEBUG=false` in production
- [ ] Use strong `APP_KEY`
- [ ] Enable HTTPS in production
- [ ] Keep dependencies updated: `composer update`, `npm update`
- [ ] Validate all user inputs
- [ ] Use `.gitignore` for `.env` file
- [ ] Implement rate limiting on API routes
- [ ] Regular backups of database
- [ ] Monitor error logs

---

## Helpful Links

- **Laravel Docs**: https://laravel.com/docs
- **React Docs**: https://react.dev
- **Inertia.js**: https://inertiajs.com
- **Tailwind CSS**: https://tailwindcss.com
- **Cloudinary**: https://cloudinary.com/documentation
- **OpenAI API**: https://platform.openai.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

---

**Last Updated**: October 2025

For more detailed information, check:
- [WHAT_IS_THIS.md](WHAT_IS_THIS.md) - Overview
- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical details
- [SYSTEM_FLOWS.md](SYSTEM_FLOWS.md) - Visual diagrams
