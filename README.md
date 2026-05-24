# 🛍️ Mens Shop — Full Stack E-Commerce Website

A professional Men's Shopping Website built with the MERN stack, featuring JWT authentication, product management, cart & wishlist, admin dashboard, and full CI/CD deployment.

![Mens Shop](https://img.shields.io/badge/Status-Live-brightgreen) ![MERN](https://img.shields.io/badge/Stack-MERN-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 🌐 Live Demo

| | URL |
|---|---|
| **Frontend** | [https://mens-shop.vercel.app](https://mens-shop.vercel.app) |
| **Backend API** | [https://mens-shop-1.onrender.com](https://mens-shop-1.onrender.com) |

---

## ✨ Features

### Customer Side
- 🔐 User Registration & Login (JWT Authentication)
- 🛍️ Product Listing with Category Filters & Search
- 📦 Product Detail Page
- 🛒 Cart with Quantity Management
- ❤️ Wishlist
- 💳 Checkout Page

### Admin Side
- 📊 Admin Dashboard with Stats
- ➕ Add / Edit / Delete Products
- 📋 View & Manage All Orders
- 👥 User Management

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS |
| **State Management** | Zustand |
| **HTTP Client** | Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose |
| **Authentication** | JWT (JSON Web Tokens) |
| **File Uploads** | Multer |
| **Deployment** | Vercel (Frontend), Render (Backend) |
| **CI/CD** | GitHub Actions |

---

## 📁 Project Structure

```
mens-shop/
├── client/                  # React + Vite Frontend
│   ├── src/
│   │   ├── components/      # Reusable components (Navbar, ProductCard)
│   │   ├── pages/           # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProductsPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── WishlistPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminProducts.jsx
│   │   │       └── AdminOrders.jsx
│   │   ├── store/           # Zustand state management
│   │   │   ├── authStore.js
│   │   │   └── cartStore.js
│   │   └── services/
│   │       └── api.js       # Axios instance
│   ├── .env
│   └── package.json
│
├── server/                  # Node.js + Express Backend
│   ├── config/
│   │   └── db.js            # MongoDB connection
│   ├── controllers/         # Route controllers
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── orderController.js
│   ├── middleware/
│   │   └── authMiddleware.js # JWT protect & adminOnly
│   ├── models/              # Mongoose models
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/              # Express routes
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── orderRoutes.js
│   ├── uploads/             # Product images
│   ├── .env
│   └── server.js
│
└── .github/
    └── workflows/
        └── deploy.yml       # GitHub Actions CI/CD
```

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/maheshkumar09104/Mens_shop.git
cd mens-shop
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

Start backend:
```bash
npm start
```

### 3. Setup Frontend
```bash
cd client
npm install
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000
```

Start frontend:
```bash
npm run dev
```

### 4. Open in Browser
```
http://localhost:5173
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get logged-in user |

### Products
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | Get all products (with filters) |
| GET | `/api/products/:id` | Get product by ID |
| POST | `/api/products` | Create product (Admin) |
| PUT | `/api/products/:id` | Update product (Admin) |
| DELETE | `/api/products/:id` | Delete product (Admin) |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders` | Create order |
| GET | `/api/orders/myorders` | Get my orders |
| GET | `/api/orders` | Get all orders (Admin) |
| PUT | `/api/orders/:id/deliver` | Mark delivered (Admin) |

---

## 🔄 CI/CD Pipeline

Every push to `main` triggers GitHub Actions:

```
git push → GitHub Actions
                ↓
          Build & Test
          /           \
   Deploy Backend    Deploy Frontend
     (Render)          (Vercel)
          \           /
           Site Live! ✅
```

### GitHub Secrets Required
| Secret | Description |
|---|---|
| `VITE_API_URL` | Render backend URL |
| `VERCEL_TOKEN` | Vercel access token |
| `RENDER_DEPLOY_HOOK_URL` | Render deploy webhook |

---

## 🌍 Deployment

| Service | Platform | Purpose |
|---|---|---|
| Frontend | Vercel | React + Vite app |
| Backend | Render | Express API server |
| Database | MongoDB Atlas | Cloud database |

---

## 👨‍💻 Developer

**Mahesh Kumar R**
- GitHub: [@maheshkumar09104](https://github.com/maheshkumar09104)
- Email: mahesh09104@gmail.com

---

## 📄 License

This project is licensed under the MIT License.
