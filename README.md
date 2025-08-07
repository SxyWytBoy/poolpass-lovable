# PoolPass UK

A modern web application for discovering and booking premium pool experiences across the UK. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Pool Discovery**: Browse and search through curated hotel and private pools
- **Location-Based Search**: Find pools in London, Cape Town, and other locations
- **User Authentication**: Secure sign-up and login for guests and hosts
- **Host Dashboard**: Comprehensive management tools for pool owners
- **Real-time Booking**: Instant confirmation system
- **Responsive Design**: Optimized for desktop and mobile devices

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Backend**: Supabase (PostgreSQL + Auth)
- **State Management**: React Query (TanStack Query)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd poolpass-uk
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── contexts/           # React context providers
├── services/           # API and external services
├── types/              # TypeScript type definitions
├── data/               # Mock data and constants
└── lib/                # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.