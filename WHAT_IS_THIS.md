# What's Happening in This Repo? 🤔

## TL;DR
**Catalog Cove** is a smart product catalog management app where businesses can:
- 📦 Create and manage product catalogs
- 🤖 Use AI to generate product titles and descriptions from images
- 🖼️ Upload and manage product images via Cloudinary
- 🏢 Set up their business profile
- 🎨 Remove image backgrounds automatically

Think of it as **Shopify meets AI** - but focused purely on catalog management, not e-commerce.

---

## 🎯 What Problem Does It Solve?

Creating product catalogs is tedious:
- Writing compelling product descriptions takes time
- Coming up with SEO-friendly titles is challenging
- Managing product images across platforms is messy
- Organizing multiple products becomes overwhelming

**Catalog Cove solves this by:**
1. Using AI (OpenAI's GPT-4) to analyze product images and auto-generate:
   - Professional product titles
   - Engaging product descriptions
2. Storing images on Cloudinary's CDN for fast, reliable access
3. Providing a clean, organized interface to manage everything

---

## 🛠️ Technology Stack (Simple Terms)

| What | Technology | Why |
|------|------------|-----|
| **Backend** | Laravel 12 (PHP) | Powerful web framework with built-in features |
| **Frontend** | React + TypeScript | Modern, fast UI with type safety |
| **Database** | SQLite | Easy to set up, works out of the box |
| **Images** | Cloudinary | Cloud storage + image processing |
| **AI** | OpenAI GPT-4o-mini | Generates product text from images |
| **Styling** | Tailwind CSS | Beautiful, responsive design |
| **Routing** | Inertia.js | React feels like native Laravel |

---

## 📂 Main Features Explained

### 1️⃣ Business Setup
- When you first sign up, you create your business profile
- Add: business name, logo, contact info (email, WhatsApp)
- This is a one-time setup

### 2️⃣ Product Management
**Create Products:**
- Add product name, description, price, stock
- Upload multiple images per product
- Products get a unique slug (URL-friendly name) automatically

**AI Magic:**
- Upload a product image
- Click "Generate Title" → AI analyzes the image and suggests a title
- Click "Generate Description" → AI writes a product description
- You can edit or regenerate as needed

**Search & Filter:**
- Search products by name or description
- Pagination for large catalogs

### 3️⃣ Media Library
- View all uploaded images in one place
- Delete unwanted images
- Remove image backgrounds using Cloudinary's AI
- Track image processing status

### 4️⃣ Authentication
- Sign up / Log in
- Email verification
- Password reset
- Secure session management

---

## 🔄 How It Works (User Flow)

```
1. Sign Up → 2. Create Business → 3. Access Dashboard
                                        ↓
                            ┌───────────┴───────────┐
                            ↓                       ↓
                      Add Products            Media Library
                            ↓                       ↓
                    Upload Image              View All Images
                            ↓                       ↓
                    AI Generates Text         Manage/Delete
                            ↓
                    Edit & Save Product
```

---

## 🧠 AI Feature Breakdown

### How AI Suggestions Work:

1. **User uploads product image** (e.g., a sneaker)
2. **Image sent to Cloudinary** (temporary storage)
3. **OpenAI GPT-4 analyzes the image**
4. **AI returns:**
   - **Title**: "Nike Air Max 270 Running Shoes"
   - **Description**: "Lightweight running shoes with superior cushioning..."
5. **User can accept, edit, or regenerate**

### Prompts Used:
- **For Titles**: "Identify the exact product name, including brand and model"
- **For Descriptions**: "Write a friendly, engaging description (max 500 chars)"

---

## 🗂️ Project Structure (Simplified)

```
catalog-cove-app/
│
├── app/                          # Backend PHP code
│   ├── Http/Controllers/        # Handles user requests
│   │   ├── ProductController    # Product CRUD operations
│   │   ├── AISuggestionController  # AI integration
│   │   ├── BusinessController   # Business setup
│   │   └── MediaLibraryController  # Image management
│   ├── Models/                  # Database models (User, Business, Product)
│   └── Services/                # Cloudinary integration
│
├── resources/js/                # Frontend React code
│   ├── Pages/                   # Main application pages
│   │   ├── Dashboard.tsx        # Main dashboard
│   │   ├── Products/            # Product pages (Create, Edit, List)
│   │   ├── Business/            # Business setup
│   │   ├── MediaLibrary/        # Image gallery
│   │   └── Auth/                # Login, Register, etc.
│   └── Components/              # Reusable UI components
│
├── database/migrations/         # Database structure
├── routes/web.php              # Application routes
└── tests/                      # Automated tests
```

---

## 🔌 External Services

### Cloudinary
- **Purpose**: Store and transform images
- **Features Used**:
  - Upload images
  - Generate thumbnails
  - Remove backgrounds (AI-powered)
  - Deliver images via global CDN

### OpenAI
- **Purpose**: Generate product content from images
- **Model**: GPT-4o-mini (vision-enabled)
- **Cost**: ~$0.00015 per image analysis (very cheap)

---

## 🚀 Getting Started (For Developers)

### 1. Clone the repo
```bash
git clone https://github.com/sheriffjimoh/catalog-cove-app.git
cd catalog-cove-app
```

### 2. Install dependencies
```bash
composer install    # PHP dependencies
npm install         # JavaScript dependencies
```

### 3. Configure environment
```bash
cp .env.example .env
php artisan key:generate
```

### 4. Set up credentials
Edit `.env` and add:
```env
CLOUDINARY_URL=cloudinary://key:secret@cloud_name
OPENAI_API_KEY=sk-your-openai-api-key
```

### 5. Set up database
```bash
touch database/database.sqlite
php artisan migrate
```

### 6. Run the app
```bash
composer dev   # Starts Laravel, queue, logs, and Vite
```

Visit: `http://localhost:8000`

---

## 🎨 Key Files to Explore

| File | Purpose |
|------|---------|
| `routes/web.php` | All application routes |
| `app/Http/Controllers/ProductController.php` | Product logic |
| `app/Http/Controllers/AISuggestionController.php` | AI integration |
| `app/Services/CloudinaryService.php` | Image upload logic |
| `resources/js/Pages/Products/Create.tsx` | Product creation UI |
| `resources/js/Pages/Dashboard.tsx` | Main dashboard |

---

## 🔐 Security Notes

- ✅ CSRF protection enabled
- ✅ Input validation on all forms
- ✅ SQL injection prevention (Eloquent ORM)
- ✅ XSS protection (React auto-escaping)
- ✅ File upload restrictions (type, size)
- ⚠️ **WARNING**: Remove `cloudinary_test.php` - contains hardcoded credentials!

---

## 📈 Current State

### ✅ Implemented
- User authentication
- Business profile management
- Product CRUD operations
- AI-powered title/description generation
- Image upload and management
- Media library
- Background removal
- Search and pagination

### 🚧 Could Be Added
- Product categories
- Inventory tracking
- Analytics dashboard
- Bulk import/export
- Public catalog view (shareable link)
- Multi-language support
- Team collaboration

---

## 💡 Fun Facts

- The app uses **Inertia.js**, which means no separate REST API needed!
- AI suggestions cost less than **$0.01 per 100 images**
- Uses **SQLite** by default = zero database setup
- Built with **Laravel 12** (latest version as of 2025)
- **TypeScript** ensures fewer bugs in React code
- Images are stored on **Cloudinary's CDN** = blazing fast loading worldwide

---

## 🤝 Contributing

This appears to be a personal/learning project, but if you want to contribute:
1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📞 Need Help?

Check these resources:
- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://react.dev)
- [Inertia.js Guide](https://inertiajs.com)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [OpenAI API Docs](https://platform.openai.com/docs)

---

**Bottom Line**: This is a modern, AI-powered product catalog tool that makes managing products easy and fun! 🎉
