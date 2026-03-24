├── public/
├── src/
│   ├── components/
│   │   └── ProductCard.tsx
│   ├── pages/
│   │   ├── index.tsx         // Product List Page
│   │   ├── _app.tsx          // App entry for React Query Provider
│   ├── lib/
│   │   └── api.ts            // Axios instance and API functions
│   ├── hooks/
│   │   └── useProducts.ts    // Custom hook using react-query
│   ├── types/
│   │   └── index.ts          // Shared types (Product, Category, etc.)
│   ├── styles/
│   │   └── globals.css
│   └── utils/
│       └── format.ts         // Helpers like formatPrice
├── .env.local                // For storing your API base URL
├── tsconfig.json             // With alias support (e.g., @/lib/api)
├── package.json
└── next.config.js
