
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create a loader component that will show while the app is initializing
const appRoot = document.getElementById("root")!;
const loader = document.createElement('div');
loader.className = 'app-loader';
loader.innerHTML = `
  <div class="flex flex-col items-center justify-center h-screen bg-white">
    <img src="/placeholder.svg" alt="Clinic Logo" class="w-32 h-32 mb-4" />
    <div class="w-16 h-16 border-4 border-t-clinic-primary border-b-clinic-primary border-r-transparent border-l-transparent rounded-full animate-spin"></div>
  </div>
`;
appRoot.appendChild(loader);

// Initialize the app with a slight delay to show the loader
setTimeout(() => {
  createRoot(appRoot).render(<App />);
  // Remove the loader after rendering completes
  setTimeout(() => {
    const loaderElement = document.querySelector('.app-loader');
    if (loaderElement) {
      loaderElement.classList.add('fade-out');
      setTimeout(() => loaderElement.remove(), 500);
    }
  }, 300);
}, 1000);
