
// Entry point for the application
// Uses React 18 with the new createRoot API for better performance
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
