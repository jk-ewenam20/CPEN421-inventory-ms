# Inventory Management System - Project Report

**Project Name:** Inventory Management System  
**Version:** 1.0.0  
**Date Generated:** February 2, 2026

---

## Executive Summary

The **Inventory Management System** is a full-stack web application built with modern technologies for managing inventory items. The system provides user authentication, inventory tracking, and item management capabilities. It follows a **MERN-like architecture** with Express.js backend and React frontend, separated into two independent applications.

---

## Architecture Overview

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   Client Layer (Frontend)                   │
│  React 18.2 + React Router + Axios                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Pages: Login, Register, Dashboard, Inventory, Items  │   │
│  │ Components: Layout, Sidebar, Topbar                  │   │
│  │ Context: AuthContext (JWT-based auth)                │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          │
                    HTTP/REST API
                   (axios requests)
                          │
┌─────────────────────────────────────────────────────────────┐
│                   API Layer (Backend)                       │
│  Express.js 4.21.2 + Mongoose 8.12.1                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Routes: /api/users, /api/items                       │   │
│  │ Controllers: users, items                            │   │
│  │ Models: User, Item (MongoDB schemas)                 │   │
│  │ Auth: JWT-based authentication                       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          │
                    MongoDB Connection
                          │
┌─────────────────────────────────────────────────────────────┐
│                 Database Layer                              │
│  MongoDB (Cloud/Local) via Mongoose ORM                     │
│  Collections: users, items                                  │
└─────────────────────────────────────────────────────────────┘
```

### Architecture Type: **Microservices-Ready Monolithic**

- **Separation of Concerns:** Frontend and backend are completely separated
- **API-Driven:** Communication via RESTful API endpoints
- **Database:** MongoDB for flexible document storage
- **Authentication:** JWT (JSON Web Tokens) for stateless authentication

---

## Project Structure

```
inventory_management_system/
│
├── express_api/                    # Backend API Server
│   ├── app.js                      # Main Express app configuration
│   ├── package.json                # Backend dependencies
│   │
│   ├── routes/
│   │   ├── users.route.js          # User authentication endpoints
│   │   └── items.route.js          # Item CRUD endpoints
│   │
│   ├── controllers/
│   │   ├── users.controller.js     # User logic (login, register)
│   │   └── items.controller.js     # Item logic (create, read, update, delete)
│   │
│   └── models/
│       ├── user.model.js           # User schema (name, email, password)
│       └── item.model.js           # Item schema (name, price, quantity, stock)
│
├── frontend/                       # React Frontend Application
│   ├── package.json                # Frontend dependencies
│   ├── public/
│   │   └── index.html              # Root HTML file
│   │
│   └── src/
│       ├── App.js                  # Main app with routing & PrivateRoute guard
│       ├── index.js                # React entry point
│       ├── index.css               # Global styles
│       │
│       ├── context/
│       │   └── AuthContext.js      # Global auth state (user, login, logout)
│       │
│       ├── pages/
│       │   ├── LoginPage.js        # Login form & authentication
│       │   ├── RegisterPage.js     # User registration
│       │   ├── Dashboard.js        # Home/dashboard view
│       │   ├── Inventory.js        # View all items
│       │   ├── AddItem.js          # Create new item
│       │   ├── EditItem.js         # Update existing item
│       │   └── Auth.css, Dashboard.css, Inventory.css, ItemForm.css
│       │
│       ├── components/
│       │   ├── Layout.js           # Shared layout (sidebar + topbar + outlet)
│       │   ├── Sidebar.js          # Navigation sidebar
│       │   ├── Topbar.js           # Top navigation bar
│       │   └── *.css               # Component styles
│       │
│       └── utils/
│           └── api.js              # Axios configuration & API client
│
└── REPORT.md                       # This file
```

---

## Technology Stack

### Frontend

| Technology           | Version | Purpose                                        |
| -------------------- | ------- | ---------------------------------------------- |
| **React**            | 18.2.0  | UI library for building interactive interfaces |
| **React Router DOM** | 6.20.3  | Client-side routing & navigation               |
| **Axios**            | 1.6.10  | HTTP client for API requests                   |
| **React Scripts**    | 5.0.1   | Build tooling & development server             |
| **Web Vitals**       | 4.0.0   | Performance monitoring                         |

### Backend

| Technology     | Version | Purpose                             |
| -------------- | ------- | ----------------------------------- |
| **Express.js** | 4.21.2  | Web framework for building REST API |
| **Mongoose**   | 8.12.1  | MongoDB ODM (Object Data Modeling)  |
| **MongoDB**    | 6.15.0  | NoSQL database driver               |
| **JWT**        | 9.0.2   | JSON Web Tokens for authentication  |
| **bcrypt**     | 5.1.1   | Password hashing & security         |
| **CORS**       | 2.8.5   | Cross-Origin Resource Sharing       |
| **dotenv**     | 16.4.7  | Environment variable management     |
| **Joi**        | 17.13.3 | Schema validation                   |
| **Nodemon**    | (dev)   | Auto-restart server on file changes |

---

## Authentication Flow

### User Registration/Login Flow

```
User Input
    ↓
POST /api/users/register or /api/users/auth
    ↓
Express Controller validates input (Joi)
    ↓
Check if email exists (User.findOne)
    ↓
Hash password with bcrypt
    ↓
Save user to MongoDB
    ↓
Generate JWT Token (jwt.sign)
    ↓
Return token & user data to frontend
    ↓
AuthContext stores token in localStorage
    ↓
Axios interceptor attaches token to all requests
    ↓
PrivateRoute checks if user exists, redirects if not
```

### JWT Token Details

- **Algorithm:** HS256 (HMAC with SHA-256)
- **Expiration:** 7 days
- **Secret Key:** Stored in `MONGO_URI` environment variable
- **Payload:** Contains user `_id`

---

## Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, min 8 chars, hashed),
  createdAt: Date (auto)
}
```

### Item Collection

```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String (optional),
  price: Number (required),
  inStock: Boolean (default: true),
  quantity: Number (default: 0),
  createdAt: Date (auto)
}
```

---

## API Endpoints

### User Endpoints

| Method | Endpoint              | Description       | Auth Required |
| ------ | --------------------- | ----------------- | ------------- |
| POST   | `/api/users/register` | Register new user | No            |
| POST   | `/api/users/auth`     | Login user        | No            |
| GET    | `/api/users/:id`      | Get user profile  | Yes           |

### Item Endpoints

| Method | Endpoint         | Description     | Auth Required |
| ------ | ---------------- | --------------- | ------------- |
| GET    | `/api/items`     | Get all items   | Yes           |
| POST   | `/api/items`     | Create new item | Yes           |
| GET    | `/api/items/:id` | Get item by ID  | Yes           |
| PUT    | `/api/items/:id` | Update item     | Yes           |
| DELETE | `/api/items/:id` | Delete item     | Yes           |

---

## Key Features

### Frontend Features

- [x] **User Authentication:** Login and registration with JWT
- [x] **Protected Routes:** Private routes that redirect to login if not authenticated
- [x] **Dashboard:** Overview of inventory statistics
- [x] **Inventory Management:** View, add, edit, and delete items
- [x] **Responsive Design:** CSS-based responsive layouts
- [x] **Global Auth State:** Context API for managing user state across app
- [x] **API Integration:** Axios with interceptors for token attachment

### Backend Features

- [x] **REST API:** Full CRUD operations for items and users
- [x] **User Authentication:** JWT-based authentication with bcrypt password hashing
- [x] **Data Validation:** Joi validation for request inputs
- [x] **Database:** MongoDB with Mongoose ORM
- [x] **CORS Support:** Cross-origin requests enabled
- [x] **Error Handling:** Proper error responses with status codes
- [x] **Environment Configuration:** dotenv for sensitive configuration

---

## Configuration

### Environment Variables Required

**Backend (.env file in `express_api/`)**

```
MONGO_URI=mongodb://[user:password@]localhost:27017/inventory_db
PORT=3002
JWT_SECRET=your-secret-key-here
```

**Frontend (uses `REACT_APP_API_URL` if needed)**

```
REACT_APP_API_URL=http://localhost:3002/api
```

---

## Running the Application

### Prerequisites

- Node.js (v14+)
- MongoDB (local or cloud instance)
- npm or yarn

### Start Backend

```bash
cd express_api
npm install
npm start
# Server runs on http://localhost:3002
```

### Start Frontend

```bash
cd frontend
npm install
npm start
# App runs on http://localhost:3000
```

---

## Important Files & Their Purposes

### Frontend Critical Files

- **[src/App.js](frontend/src/App.js)**: Main routing configuration and PrivateRoute guard
- **[src/context/AuthContext.js](frontend/src/context/AuthContext.js)**: Global authentication state management
- **[src/utils/api.js](frontend/src/utils/api.js)**: Axios configuration with JWT interceptor
- **[src/pages/LoginPage.js](frontend/src/pages/LoginPage.js)**: User login form
- **[src/components/Layout.js](frontend/src/components/Layout.js)**: Shared layout component

### Backend Critical Files

- **[app.js](express_api/app.js)**: Express app initialization and middleware setup
- **[models/user.model.js](express_api/models/user.model.js)**: User schema with auth methods
- **[models/item.model.js](express_api/models/item.model.js)**: Item schema definition
- **[controllers/users.controller.js](express_api/controllers/users.controller.js)**: Auth logic
- **[routes/users.route.js](express_api/routes/users.route.js)**: User endpoints
- **[routes/items.route.js](express_api/routes/items.route.js)**: Item endpoints

---

## Known Issues & Notes

1. **Path Issues (Resolved):** The frontend had issues with spaces in folder path. Fixed by using direct node invocation in npm scripts.
2. **Deprecated Dependencies:** Some npm packages show deprecation warnings but are functional.
3. **Item User Association:** Items are not currently tied to users. Consider adding `userId` field to item schema for multi-user support.

---

## Future Enhancements

1. **User-Specific Inventory:** Link items to users (add `userId` to Item schema)
2. **Item Categories:** Add category support for better organization
3. **Search & Filter:** Implement search and filtering functionality
4. **Pagination:** Add pagination to inventory list
5. **Image Upload:** Support for item images
6. **Analytics Dashboard:** More detailed statistics and reporting
7. **Audit Logs:** Track changes to inventory
8. **Role-Based Access:** Support for different user roles (admin, user, etc.)
9. **Real-time Updates:** WebSocket integration for live inventory updates
10. **API Documentation:** OpenAPI/Swagger documentation

---

## Security Considerations

[x] **Implemented:**

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Environment variable for secrets
- Input validation with Joi

[!] **Recommended Improvements:**

- Add rate limiting to prevent brute force attacks
- Implement HTTPS in production
- Add request logging for security auditing
- Implement refresh tokens for better token management
- Add API key authentication for sensitive endpoints
- Validate all user inputs on both frontend and backend

---

## Development Notes

### Code Quality

- Code follows consistent naming conventions
- Components are modular and reusable
- Separation of concerns between routes, controllers, and models
- Context API used for state management (no Redux overhead for this scale)

### Performance Observations

- React 18 provides good performance out of the box
- MongoDB queries are optimized with proper indexing
- Axios interceptors reduce code duplication

---

## Support & Maintenance

For issues or questions:

1. Check the project structure in `REPORT.md` (this file)
2. Review environment variable configuration
3. Check MongoDB connection string in `.env`
4. Ensure both frontend and backend are running on correct ports

---

**Report Generated:** February 2, 2026  
**Project Status:** [x] Functional and Ready for Use
