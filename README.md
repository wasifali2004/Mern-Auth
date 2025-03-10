MERN Authentication System

This is a full authentication system built using the MERN (MongoDB, Express, React, Node.js) stack. It includes features such as user registration, login, email verification, and password reset.

Features
User Registration
Login with JWT authentication
Email verification
Password reset functionality
Secure authentication using bcrypt and JWT
Protected routes for authenticated users

Tech Stack
Frontend: React, Axios, React Router
Backend: Node.js, Express.js
Database: MongoDB (Mongoose ODM)
Authentication: JWT, bcrypt, Nodemailer

API Endpoints
POST /api/auth/register - Register a new user
POST /api/auth/login - Login user
GET /api/auth/verify-email - Verify email
POST /api/auth/reset-password - Request password reset
POST /api/auth/reset-password/****:token - Reset password

License
This project is open-source and available under the MIT License.

Author
Wasif Ali
