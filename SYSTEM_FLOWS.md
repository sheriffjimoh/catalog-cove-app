# Catalog Cove - System Flow Diagrams

## 🔄 Application Flow Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER JOURNEY                              │
└─────────────────────────────────────────────────────────────────┘

    ┌──────────┐
    │  Visitor │
    └────┬─────┘
         │
         ├─────► [Sign Up] ────────────────┐
         │                                  │
         └─────► [Login] ────────────────┐ │
                                         │ │
                                         ▼ ▼
                                    ┌─────────┐
                                    │ User DB │
                                    └────┬────┘
                                         │
                    ┌────────────────────┴───────────────────┐
                    │                                        │
                    ▼                                        ▼
            [No Business?]                            [Has Business?]
                    │                                        │
                    │ YES                                    │ YES
                    ▼                                        ▼
        ┌──────────────────────┐                  ┌─────────────────┐
        │  Business Setup      │                  │   Dashboard     │
        │  - Company Name      │                  │   - Overview    │
        │  - Logo Upload       │                  │   - Quick Stats │
        │  - Contact Info      │                  └────────┬────────┘
        └──────────┬───────────┘                           │
                   │                                       │
                   └───────────────┬───────────────────────┘
                                   │
                    ┌──────────────┴─────────────┐
                    │                            │
                    ▼                            ▼
           ┌─────────────────┐        ┌──────────────────┐
           │ Product Manager │        │  Media Library   │
           └────────┬────────┘        └────────┬─────────┘
                    │                           │
        ┌───────────┼───────────┐               │
        │           │           │               │
        ▼           ▼           ▼               ▼
    [Create]    [Edit]     [Delete]      [View Images]
        │           │           │               │
        └───────────┴───────────┴───────────────┘
```

---

## 🤖 AI Suggestion Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    AI CONTENT GENERATION                         │
└─────────────────────────────────────────────────────────────────┘

User Action                 Backend Processing              External APIs
───────────                ────────────────────            ─────────────

[Upload Image]
     │
     ├──► Image File ────► Laravel Controller
     │                          │
     │                          ▼
     │                   CloudinaryService ────────────► Cloudinary API
     │                          │                             │
     │                          │                             ▼
     │                          │                    ┌──────────────────┐
     │                          │                    │ Upload to Cloud  │
     │                          │                    │ Get Secure URL   │
     │                          │                    └────────┬─────────┘
     │                          │                             │
     │                          ▼                             │
     │                   ┌─────────────┐                      │
     │                   │ Store URL   │◄─────────────────────┘
     │                   └──────┬──────┘
     │                          │
     └──► [Click "Generate"]    │
                                ▼
                      AISuggestionController
                                │
                                ├──► Build AI Prompt
                                │    (Title or Description)
                                │
                                ▼
                         OpenAI API Call ─────────────► OpenAI GPT-4
                                │                             │
                                │                             ▼
                                │                    ┌──────────────────┐
                                │                    │ Analyze Image    │
                                │                    │ Generate Text    │
                                │                    └────────┬─────────┘
                                │                             │
                                ▼                             │
                         ┌─────────────┐                      │
                         │ Get Response│◄─────────────────────┘
                         └──────┬──────┘
                                │
                                ▼
                     ┌─────────────────────┐
                     │ Return JSON Response│
                     │ - image_url         │
                     │ - suggestion        │
                     │ - type              │
                     └──────┬──────────────┘
                            │
                            ▼
                    [Display in React UI]
                            │
                            ▼
                   ┌────────────────────┐
                   │ User Reviews       │
                   │ - Accept           │
                   │ - Edit             │
                   │ - Regenerate       │
                   └────────────────────┘
```

---

## 📦 Product Creation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRODUCT CREATION PROCESS                      │
└─────────────────────────────────────────────────────────────────┘

Step 1: Navigate to Create Product
    ↓
Step 2: Fill Basic Info
    ├─ Product Name (required)
    ├─ Description (optional)
    ├─ Price (optional)
    └─ Stock (optional)
    ↓
Step 3: Upload Images (optional)
    ├─ Select multiple files
    ├─ Validate: jpg/png, max 5MB each
    └─ Preview images
    ↓
Step 4: Use AI Features (optional)
    ├─ Generate Title from Image
    │   ├─ Upload/Select image
    │   ├─ AI analyzes image
    │   └─ Suggests product title
    │
    └─ Generate Description from Image
        ├─ Upload/Select image
        ├─ AI analyzes image
        └─ Suggests description (max 500 chars)
    ↓
Step 5: Review & Submit
    ├─ Validate form data
    ├─ Upload images to Cloudinary
    ├─ Create product record in DB
    └─ Auto-generate slug
    ↓
Step 6: Redirect to Products List
    └─ Show success message

┌──────────────────────────────────┐
│         Database Records         │
├──────────────────────────────────┤
│ products table:                  │
│   ├─ id (auto)                   │
│   ├─ business_id (FK)            │
│   ├─ name                        │
│   ├─ slug (auto: name-timestamp) │
│   ├─ description                 │
│   ├─ price                       │
│   ├─ stock                       │
│   └─ timestamps                  │
│                                  │
│ product_images table:            │
│   ├─ id (auto)                   │
│   ├─ product_id (FK)             │
│   ├─ url (Cloudinary)            │
│   ├─ is_processed (bool)         │
│   └─ timestamps                  │
└──────────────────────────────────┘
```

---

## 🖼️ Image Upload & Processing Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    IMAGE MANAGEMENT FLOW                         │
└─────────────────────────────────────────────────────────────────┘

Upload Image
    ↓
┌──────────────────────┐
│ Client (React)       │
│ - Select image       │
│ - Validate size      │
│ - Preview            │
└─────────┬────────────┘
          │
          ▼
┌──────────────────────┐
│ FormData POST        │
│ - multipart/form-data│
└─────────┬────────────┘
          │
          ▼
┌──────────────────────────────┐
│ Laravel Controller           │
│ - Validate: jpg/png, 5MB max │
│ - Get file path              │
└─────────┬────────────────────┘
          │
          ▼
┌──────────────────────────────┐
│ CloudinaryService            │
│ - Configure with URL         │
│ - Call upload API            │
│ - Specify folder path        │
└─────────┬────────────────────┘
          │
          ▼
┌──────────────────────────────────────┐
│ Cloudinary API                       │
│ - Receives file                      │
│ - Stores in CDN                      │
│ - Generates transformations          │
│ - Returns secure_url                 │
└─────────┬────────────────────────────┘
          │
          ▼
┌──────────────────────────────────────┐
│ Store in Database                    │
│ - Save secure_url                    │
│ - Link to product/business           │
│ - Set is_processed = false           │
└─────────┬────────────────────────────┘
          │
          ▼
┌──────────────────────────────────────┐
│ Return Response                      │
│ - Image URL                          │
│ - Success status                     │
└──────────────────────────────────────┘


Background Removal (Optional):
    ↓
┌──────────────────────────────────────┐
│ User clicks "Remove Background"      │
└─────────┬────────────────────────────┘
          │
          ▼
┌──────────────────────────────────────┐
│ CloudinaryService.removeBackground() │
│ - Upload with option:                │
│   background_removal: "cloudinary_ai"│
└─────────┬────────────────────────────┘
          │
          ▼
┌──────────────────────────────────────┐
│ Cloudinary AI Processing             │
│ - Detects subject                    │
│ - Removes background                 │
│ - Returns processed image            │
└─────────┬────────────────────────────┘
          │
          ▼
┌──────────────────────────────────────┐
│ Update Database                      │
│ - Save new URL                       │
│ - Set is_processed = true            │
└──────────────────────────────────────┘
```

---

## 🔐 Authentication & Middleware Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                           │
└─────────────────────────────────────────────────────────────────┘

HTTP Request
    ↓
┌────────────────────┐
│ Route Middleware   │
└─────────┬──────────┘
          │
          ▼
    ┌─────────┐
    │  auth   │ ◄──── Is user logged in?
    └────┬────┘
         │ YES
         ▼
    ┌──────────────┐
    │ no.business  │ ◄──── For /business/create only
    └────┬─────────┘       (user shouldn't have business)
         │ OR
         ▼
    ┌─────────────────┐
    │ business.exists │ ◄──── For dashboard & products
    └────┬────────────┘       (user must have business)
         │ YES
         ▼
┌────────────────────┐
│   Controller       │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Process Request    │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Inertia Response   │
│ (React page + data)│
└────────────────────┘


Middleware Logic:

┌──────────────────────────────────────┐
│ no.business middleware:              │
│ - Check if user has a business       │
│ - If YES: redirect to dashboard      │
│ - If NO: continue (allow access)     │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ business.exists middleware:          │
│ - Check if user has a business       │
│ - If NO: redirect to business/create │
│ - If YES: continue (allow access)    │
└──────────────────────────────────────┘
```

---

## 🏗️ Data Relationships

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE RELATIONSHIPS                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│    User      │
│──────────────│
│ id           │
│ name         │
│ email        │
│ password     │
│ role         │
└──────┬───────┘
       │
       │ hasOne
       │
       ▼
┌──────────────┐
│  Business    │
│──────────────│
│ id           │
│ user_id  ────┼──► FK to users.id
│ name         │
│ logo         │
│ email        │
│ whatsapp     │
│ address      │
│ short_note   │
└──────┬───────┘
       │
       │ hasMany
       │
       ▼
┌──────────────┐
│   Product    │
│──────────────│
│ id           │
│ business_id ─┼──► FK to businesses.id
│ name         │
│ slug         │
│ description  │
│ price        │
│ stock        │
└──────┬───────┘
       │
       │ hasMany
       │
       ▼
┌─────────────────┐
│ ProductImage    │
│─────────────────│
│ id              │
│ product_id ─────┼──► FK to products.id
│ url             │
│ is_processed    │
└─────────────────┘


Cascade Logic:
- Delete User → Delete Business → Delete Products → Delete Product Images
- One User can have ONE Business
- One Business can have MANY Products
- One Product can have MANY Images
```

---

## 🌐 Frontend-Backend Communication (Inertia.js)

```
┌─────────────────────────────────────────────────────────────────┐
│                    INERTIA.JS DATA FLOW                          │
└─────────────────────────────────────────────────────────────────┘

Traditional SPA:                    Inertia.js:
─────────────                       ──────────

Frontend (React)                    Frontend (React)
      │                                   │
      ├─ API Request ──►              User Action
      │                                   │
Backend (Laravel API)                     ├─ Inertia Request ──►
      │                                   │
      ├─ JSON Response ◄─              Backend (Laravel)
      │                                   │
Frontend (React)                          ├─ Inertia Response ◄─
      │                                   │  (page + props)
      └─ Update State                     │
                                       Frontend (React)
                                          │
                                          └─ Auto-render page


Example: Products List

1. User clicks "Products"
      ↓
2. Inertia sends request to /products
      ↓
3. Laravel ProductController
   - Fetches products from DB
   - Returns Inertia::render('Products/Index', ['products' => $products])
      ↓
4. Inertia sends:
   {
     "component": "Products/Index",
     "props": {
       "products": [...],
       "filters": {...}
     }
   }
      ↓
5. React receives props
   - Mounts Products/Index component
   - Renders with data
      ↓
6. User sees product list
   - No page reload
   - No separate API needed
```

---

## 📊 Technology Stack Visualization

```
┌─────────────────────────────────────────────────────────────────┐
│                        TECH STACK LAYERS                         │
└─────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                         │
├───────────────────────────────────────────────────────────────┤
│  React 18 + TypeScript                                         │
│  ├─ Components (Reusable UI)                                   │
│  ├─ Pages (Inertia components)                                 │
│  ├─ Layouts (Page structure)                                   │
│  ├─ Hooks (Custom logic)                                       │
│  └─ Contexts (State management)                                │
│                                                                │
│  Tailwind CSS (Styling)                                        │
│  ├─ Utility classes                                            │
│  ├─ Dark mode support                                          │
│  └─ Responsive design                                          │
│                                                                │
│  UI Libraries                                                  │
│  ├─ @headlessui/react (Accessible components)                  │
│  ├─ lucide-react (Icons)                                       │
│  ├─ sonner (Notifications)                                     │
│  └─ next-themes (Theme switching)                              │
└───────────────────────────────────────────────────────────────┘
                              ↕
                        Inertia.js
                              ↕
┌───────────────────────────────────────────────────────────────┐
│                         BACKEND LAYER                          │
├───────────────────────────────────────────────────────────────┤
│  Laravel 12 (PHP 8.2+)                                         │
│  ├─ Controllers (Request handling)                             │
│  ├─ Models (Data layer)                                        │
│  ├─ Middleware (Auth, business checks)                         │
│  ├─ Services (Business logic)                                  │
│  └─ Requests (Validation)                                      │
│                                                                │
│  Authentication                                                │
│  ├─ Laravel Fortify (Login, register, etc.)                    │
│  └─ Laravel Sanctum (API tokens)                               │
│                                                                │
│  Queue System                                                  │
│  └─ Database driver (Background jobs)                          │
└───────────────────────────────────────────────────────────────┘
                              ↕
┌───────────────────────────────────────────────────────────────┐
│                      PERSISTENCE LAYER                         │
├───────────────────────────────────────────────────────────────┤
│  Database: SQLite / MySQL / PostgreSQL                         │
│  ├─ users                                                      │
│  ├─ businesses                                                 │
│  ├─ products                                                   │
│  ├─ product_images                                             │
│  └─ cache, sessions, jobs tables                               │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                         │
├───────────────────────────────────────────────────────────────┤
│  Cloudinary                                                    │
│  ├─ Image upload                                               │
│  ├─ Image transformations                                      │
│  ├─ Background removal (AI)                                    │
│  └─ CDN delivery                                               │
│                                                                │
│  OpenAI                                                        │
│  ├─ GPT-4o-mini model                                          │
│  ├─ Vision API (image analysis)                                │
│  └─ Text generation                                            │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│                       BUILD TOOLS                              │
├───────────────────────────────────────────────────────────────┤
│  Vite 7 (Frontend bundler)                                     │
│  Composer (PHP dependencies)                                   │
│  npm (JavaScript dependencies)                                 │
│  Concurrently (Run multiple dev servers)                       │
└───────────────────────────────────────────────────────────────┘
```

---

**Note**: These diagrams are simplified representations of the actual system flows. For detailed implementation, refer to the source code and [ARCHITECTURE.md](ARCHITECTURE.md).
