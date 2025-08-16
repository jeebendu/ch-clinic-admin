
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { getEnvVariable } from './utils/envUtils.ts';

// Create a loader component that will show while the app is initializing
const appRoot = document.getElementById("root")!;
const loader = document.createElement('div');
const logoUrl = getEnvVariable('LOGO_URL');

loader.className = 'app-loader';
loader.innerHTML = `
  <div class="flex flex-col items-center justify-center h-screen bg-white">
    <img src="{logoUrl}" alt="Clinichub.care" class="h-15 mb-4" />
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
