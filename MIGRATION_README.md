# Reactive Wings - React TypeScript Frontend

A modern React + TypeScript application for real-time flight monitoring at Ben Gurion International Airport.

## 🚀 Migration Complete

This project has been successfully migrated from vanilla JavaScript to React with TypeScript using Vite.

## 📁 Project Structure

```
react-app/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── DashboardNav.tsx
│   │   ├── Features.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── Stats.tsx
│   │   ├── SubscriptionForm.tsx
│   │   ├── SubscriptionsList.tsx
│   │   └── Toast.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuthCallback.ts
│   │   ├── useToast.ts
│   │   └── useUserInfo.ts
│   ├── pages/               # Page components
│   │   ├── DashboardPage.tsx
│   │   └── HomePage.tsx
│   ├── services/            # API service modules
│   │   ├── auth.ts
│   │   ├── flights.ts
│   │   └── user.ts
│   ├── styles/              # Component-specific CSS
│   │   ├── Dashboard.css
│   │   ├── DashboardNav.css
│   │   ├── Features.css
│   │   ├── Header.css
│   │   ├── Hero.css
│   │   ├── Loading.css
│   │   ├── Stats.css
│   │   ├── SubscriptionForm.css
│   │   ├── SubscriptionsList.css
│   │   └── Toast.css
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   │   └── dateUtils.ts
│   ├── App.tsx              # Main App component with routing
│   ├── main.tsx             # Application entry point
│   └── config.ts            # Configuration (API URLs, etc.)
├── .env                     # Environment variables
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🛠️ Tech Stack

- **React 18** - Modern UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **CSS** - Component-scoped styling

## 📦 Installation

```bash
cd react-app
npm install
```

## 🔧 Configuration

Create a `.env` file in the `react-app` directory:

```env
VITE_BACKEND_URL=http://localhost:8080/
```

## 🚀 Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## 📝 Key Features

### Home Page (`/`)
- Hero section with call-to-action
- Features showcase
- System statistics
- Google OAuth sign-in

### Dashboard Page (`/dashboard`)
- Flight subscription form
- Active subscriptions list
- User information display
- Real-time subscription management
- Unsubscribe functionality

## 🔐 Authentication

The app uses Google OAuth 2.0 for authentication:
- Token stored in `localStorage`
- Automatic redirect to home if unauthenticated
- OAuth callback handling on dashboard mount

## 🎨 Component Organization

### Pages
- `HomePage` - Landing page with marketing content
- `DashboardPage` - Main application dashboard

### Components
- **Header** - Main navigation with sign-in
- **Hero** - Hero section with CTA
- **Features** - Feature cards grid
- **Stats** - Animated statistics section
- **DashboardNav** - Dashboard navigation with logout
- **SubscriptionForm** - Form to subscribe to flights
- **SubscriptionsList** - List of active subscriptions
- **Toast** - Toast notifications
- **LoadingSpinner** - Loading overlay

### Hooks
- `useUserInfo` - Fetch and manage user data
- `useToast` - Toast notification management
- `useAuthCallback` - Handle OAuth callback

### Services
- `auth.ts` - Authentication utilities
- `flights.ts` - Flight search and subscription APIs
- `user.ts` - User info and logout APIs

## 🎯 Type Safety

All components and services are fully typed with TypeScript:
- Interface definitions in `src/types/index.ts`
- Prop type validation
- API response typing
- State management typing

## 🔄 Migration Notes

### What Changed
1. ✅ Converted vanilla JS to React components
2. ✅ Added TypeScript for type safety
3. ✅ Implemented React Router for navigation
4. ✅ Created custom hooks for state management
5. ✅ Modularized CSS by component
6. ✅ Improved code organization and maintainability

### What Stayed the Same
- Backend API integration
- Authentication flow
- UI/UX design
- Feature functionality
- CSS styling (migrated, not redesigned)

## 🔗 API Endpoints

The frontend communicates with the backend at:
- `GET /flights/search` - Search for flights
- `POST /users/subscribe` - Subscribe to flight
- `POST /users/unsubscribe` - Unsubscribe from flight
- `GET /users/user-info` - Get user information
- `POST /logout` - Logout user
- `/oauth2/authorization/google` - Google OAuth login

## 📱 Responsive Design

The application is fully responsive:
- Desktop (1200px+)
- Tablet (768px - 1200px)
- Mobile (< 768px)

## 🐛 Troubleshooting

### Build Errors
If you encounter TypeScript errors:
```bash
npm run build -- --mode development
```

### Port Already in Use
Change the port in `vite.config.ts`:
```typescript
export default defineConfig({
  server: {
    port: 3000
  }
})
```

## 📄 License

This project is part of the Reactive Wings flight monitoring system.

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for all new files
3. Add proper type definitions
4. Test components before committing
5. Follow React best practices

## 📞 Support

For issues and questions, please refer to the main project repository.
