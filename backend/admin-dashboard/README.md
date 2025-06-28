# Vidhyarthi Seva Admin Dashboard

A comprehensive Next.js admin dashboard for managing all Vidhyarthi Seva student services.

## 🚀 Features

- **Modern UI**: Built with Next.js 14, TypeScript, and Tailwind CSS
- **ShadCN UI**: Beautiful, accessible components
- **Authentication**: Secure login with JWT tokens
- **Service Management**: Complete CRUD operations for all services
- **Responsive Design**: Works on all devices
- **Real-time Updates**: Live data synchronization

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (see backend README)

## 🛠️ Installation

1. **Navigate to the admin dashboard directory**
   ```bash
   cd backend/admin-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
admin-dashboard/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── login/          # Login page
│   │   ├── dashboard/      # Main dashboard
│   │   ├── globals.css     # Global styles
│   │   └── layout.tsx      # Root layout
│   ├── components/         # Reusable components
│   │   ├── ui/            # ShadCN UI components
│   │   └── dashboard/     # Dashboard-specific components
│   ├── lib/               # Utilities and services
│   │   ├── api.ts         # API service
│   │   └── utils.ts       # Utility functions
│   └── types/             # TypeScript type definitions
├── public/                # Static assets
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── next.config.js         # Next.js configuration
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 UI Components

Built with ShadCN UI components:
- Button (with gradient variants)
- Card
- Input
- Label
- Dialog
- Dropdown Menu
- Toast notifications
- And more...

## 🔐 Authentication

- JWT-based authentication
- Protected routes
- Automatic token management
- Logout functionality

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interface

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## 🔗 API Integration

The dashboard connects to the backend API at `http://localhost:5000/api` by default. Update the `NEXT_PUBLIC_API_URL` environment variable to change the API endpoint.

## 📄 License

This project is part of the Vidhyarthi Seva platform. 