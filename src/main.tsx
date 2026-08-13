import { createRoot } from 'react-dom/client';
import emailjs from '@emailjs/browser';
import App from './App';
import './index.css';
import { EMAILJS_CONFIG } from '@/lib/emailjs';

emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

createRoot(document.getElementById('root')!).render(<App />);
