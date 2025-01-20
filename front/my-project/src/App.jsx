// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import OrderManagement from './components/pages/OrderManagement';
import InventoryManagement from './components/pages/InventoryManagement';
import ProductList from "./components/pages/ProductList";  // パスを修正


function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/orders" replace />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/orders" element={<OrderManagement />} />
          <Route path="/shipments" element={<div>出荷管理（実装予定）</div>} />
          <Route path="/inventory" element={<InventoryManagement />} />
          <Route path="/inventory/add" element={<div>在庫追加（実装予定）</div>} />
          <Route path="/lists" element={<div>一覧表示（実装予定）</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;