# Vidhyarthi Seva Backend

A comprehensive MERN stack backend for the Vidhyarthi Seva student services platform.

## 🚀 Features

- **Authentication System**: JWT-based authentication with email verification
- **User Management**: Complete CRUD operations with role-based access control
- **Security**: Password hashing, rate limiting, CORS protection
- **Email Services**: Automated email verification and password reset
- **API Documentation**: RESTful API endpoints with validation
- **Error Handling**: Comprehensive error handling and logging

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Gmail account for email services

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # MongoDB Configuration
   MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/vidhyarthi_seva?retryWrites=true&w=majority
   
   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   JWT_EXPIRE=30d
   
   # Email Configuration (Gmail)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   EMAIL_FROM=noreply@vidhyarthiseva.com
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📁 Project Structure

```
backend/
├── models/              # Database models
│   └── User.js         # User model with authentication
├── routes/              # API routes
│   ├── auth.js         # Authentication routes
│   ├── users.js        # User management routes
│   ├── courses.js      # Course routes (Phase 2)
│   ├── meals.js        # Meal routes (Phase 2)
│   ├── accommodations.js # Accommodation routes (Phase 2)
│   ├── mentors.js      # Mentor routes (Phase 2)
│   ├── testSeries.js   # Test series routes (Phase 2)
│   ├── gym.js          # Gym routes (Phase 2)
│   └── library.js      # Library routes (Phase 2)
├── middleware/          # Custom middleware
│   ├── auth.js         # Authentication middleware
│   └── errorHandler.js # Error handling middleware
├── utils/              # Utility functions
│   ├── jwtUtils.js     # JWT token utilities
│   └── emailService.js # Email service utilities
├── server.js           # Main server file
├── package.json        # Dependencies and scripts
└── README.md          # This file
```

## 🔐 Authentication API

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "password123",
  "role": "student"
}
```

### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Verify Email
```http
POST /api/auth/verify-email
Content-Type: application/json

{
  "token": "verification_token_here"
}
```

### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_here",
  "password": "newpassword123"
}
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <jwt_token>
```

## 👥 User Management API

### Get All Users (Admin Only)
```http
GET /api/users?page=1&limit=10&role=student&search=john
Authorization: Bearer <jwt_token>
```

### Get Single User
```http
GET /api/users/:id
Authorization: Bearer <jwt_token>
```

### Update User Profile
```http
PUT /api/users/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "9876543210",
  "bio": "Updated bio"
}
```

### Delete User (Admin Only)
```http
DELETE /api/users/:id
Authorization: Bearer <jwt_token>
```

### Get User Statistics (Admin Only)
```http
GET /api/users/stats/overview
Authorization: Bearer <jwt_token>
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt password encryption
- **Email Verification**: Required email verification for new accounts
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Protection**: Cross-origin resource sharing protection
- **Input Validation**: Comprehensive input validation using express-validator
- **Role-based Access Control**: Different access levels for different user roles

## 📧 Email Services

The backend includes automated email services for:
- **Email Verification**: Sent when users register
- **Password Reset**: Sent when users request password reset
- **Welcome Email**: Sent after email verification

## 🚦 API Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "token": "jwt_token_here" // for auth endpoints
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ] // for validation errors
}
```

## 🧪 Testing

### Health Check
```http
GET /api/health
```

Response:
```json
{
  "success": true,
  "message": "Vidhyarthi Seva Backend is running successfully!",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

## 🔧 Development

### Available Scripts
- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon
- `npm test`: Run tests (to be implemented)

### Environment Variables
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT signing secret
- `JWT_EXPIRE`: JWT expiration time
- `EMAIL_HOST`: SMTP host
- `EMAIL_PORT`: SMTP port
- `EMAIL_USER`: SMTP username
- `EMAIL_PASS`: SMTP password
- `EMAIL_FROM`: From email address

## 📝 User Roles

- **student**: Regular student user
- **admin**: Administrator with full access
- **mentor**: Mentor/teacher role
- **staff**: Staff member role

## 🔄 Phase 1 Status

✅ **Completed:**
- Backend foundation setup
- User authentication system
- JWT token management
- Email verification system
- Password reset functionality
- User management API
- Security middleware
- Error handling
- Input validation

🔄 **Next Phase (Phase 2):**
- Course management
- Meal services
- Accommodation management
- Mentor system
- Test series
- Gym facilities
- Library services

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team. 