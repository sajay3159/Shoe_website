import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx'
import { ShopProvider } from './store/ShopContext.jsx';

createRoot(document.getElementById('root')).render(
  <ShopProvider>
    <App />
  </ShopProvider>,
)
