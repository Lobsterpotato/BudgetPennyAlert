
# Expense Tracker Application

## Technology Stack

This application is built with modern web technologies:

### Frontend Framework
- **React 18**: A JavaScript library for building user interfaces
- **TypeScript**: Adds static typing to JavaScript
- **React Router**: For client-side routing
- **React Hook Form**: For form handling and validation
- **Zod**: For schema validation

### UI Components and Styling
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality React components built on Radix UI
- **Lucide React**: Icon library
- **date-fns**: JavaScript date utility library

### State Management
- **React Context API**: For application state management
- **TanStack React Query**: For data fetching and caching

### Data Visualization
- **Recharts**: A composable charting library for React

### Build Tools
- **Vite**: Next generation frontend tooling

## Project Structure

- `/src`: Source code
  - `/components`: Reusable UI components
    - `/ui`: shadcn UI components
  - `/context`: React context providers
  - `/data`: Mock data and data generation
  - `/hooks`: Custom React hooks
  - `/lib`: Utility functions
  - `/pages`: Page components
  - `/types`: TypeScript type definitions

## Key Features

1. **Expense Tracking**: Add, view, and delete expenses
2. **Dashboard**: Visual summary of spending patterns
3. **Filtering**: Filter expenses by date, category, amount, and text search
4. **Reports**: Visual representations of spending data
5. **Responsive Design**: Works on desktop and mobile

## Development

This project uses Vite for development and building. To run the project:

```
npm install
npm run dev
```

For production builds:

```
npm run build
```

## Component Architecture

The application follows a component-based architecture:

- **Layout Component**: Provides the overall page structure
- **ExpenseContext**: Central state management
- **ExpenseForm**: Form for adding expenses
- **ExpenseList**: Displays and manages expenses
- **ExpenseFilters**: Provides filtering controls
- **DashboardSummary**: Visual overview with charts

In a real-world application, this would be connected to a backend API for data persistence.
