import { HashRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './ui/layouts/MainLayout';
import Dashboard from './ui/pages/Dashboard';
import Analysis from './ui/pages/Analysis';
import Orders from './ui/pages/Orders';
import Products from './ui/pages/Products';

import { AuthProvider } from './core/AuthContext';
import DesktopLoginOverlay from './ui/components/DesktopLoginOverlay';

function App() {
  return (
    <AuthProvider>
      <DesktopLoginOverlay />
      <HashRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/products" element={<Products />} />
          </Routes>
        </MainLayout>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
