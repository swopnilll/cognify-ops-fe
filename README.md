# Folder Structure

```yaml
REACT-STARTER-TS/
│── node_modules/         # Project dependencies
│── public/               # Static assets
│── src/                  # Main source code
│   │── axios/            # Axios instance & API token management
│   │   │── axiosInstance.ts
│   │   │── config.ts
│   │   │── tokenCRUD.ts
│   │── components/       # Reusable UI & shared components
│   │   │── shared/
│   │   │── ui/
│   │── contexts/         # Context API for global state management
│   │   │── AuthContext.tsx
│   │   │── AuthProvider.tsx
│   │── hooks/            # Custom hooks
│   │   │── useAuth.ts
│   │── routes/           # Route definitions
│   │   │── __root.tsx
│   │   │── index.tsx
│   │   │── login.tsx
│   │── services/         # Business logic & API services
│   │   │── authService.ts
│   │── styles/           # Global styles
│   │   │── index.css
│   │── types/            # TypeScript type definitions
│   │   │── authTypes.ts
│   │── App.tsx           # Root component
│   │── main.tsx          # Entry point
│   │── routeTree.gen.ts  # Auto-generated route tree
│   │── vite-env.d.ts     # Vite environment types
│── .gitignore            # Git ignored files
│── eslint.config.js      # ESLint configuration
│── Readme.md             # Project documentation

```
