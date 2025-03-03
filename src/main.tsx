
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { sendCurrentUrlToParent, setupMessageListener } from './utils/postMessage'

// Try to send initial postMessage as early as possible
sendCurrentUrlToParent();

// Set up message listener
setupMessageListener();

// Set up a listener to let parent frames know when we're fully loaded
window.addEventListener('load', () => {
  sendCurrentUrlToParent();
  console.log('Window load postMessage sent');
});

// Also send when DOM content is loaded (earlier than load)
document.addEventListener('DOMContentLoaded', () => {
  sendCurrentUrlToParent();
  console.log('DOMContentLoaded postMessage sent');
});

createRoot(document.getElementById("root")!).render(<App />);
