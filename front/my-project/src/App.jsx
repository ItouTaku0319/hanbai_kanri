// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import OrderManagement from './components/pages/OrderManagement';
import SyohinList from './components/pages/syohin/SyohinList';
import ZaikoList from './components/pages/zaiko/ZaikoList';
import ShippingForm from './components/pages/ShippingForm';
import AdditionalShippingForm from './components/pages/AdditionalShippingForm';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/orders" replace />} />
          <Route path="/SyohinList" element={<SyohinList />} />
          <Route path="/orders" element={<OrderManagement />} />
          <Route path="/shipments" element={<ShippingForm />} />
          <Route path="/shipping/additional/:orderNumber" element={<AdditionalShippingForm />} />
          <Route path="/zaikoList" element={<ZaikoList />} />
          <Route path="/inventory/add" element={<div>在庫追加（実装予定）</div>} />
          <Route path="/lists" element={<div>一覧表示（実装予定）</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;