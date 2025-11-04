import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import axios from 'axios'

// Set axios defaults globally for cross-origin requests
axios.defaults.withCredentials = true;

createRoot(document.getElementById("root")!).render(<App />);
