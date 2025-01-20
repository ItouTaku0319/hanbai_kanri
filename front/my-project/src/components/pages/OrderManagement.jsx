// src/components/pages/OrderManagement.jsx
import React, { useState } from 'react';
import { Upload, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // 追加
import OrderDetailModal from '../modals/OrderDetailModal';

const OrderManagement = () => {
  const navigate = useNavigate(); // 追加
  const [orders, setOrders] = useState([
    {
      jyutyu_no: '001',
      jyutyu_date: '2025-01-14',
      noki: '2025-01-20',
      status: '未出荷',
      items: [
        { syohin: '鉄の剣', jyutyu_su: 5 },
        { syohin: '銅の盾', jyutyu_su: 3 }
      ]
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('Uploaded file:', file.name);
    }
  };

  const handleShowDetail = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const handleShipping = () => {
    navigate(`/shipments`);
  };

    // 追加出荷画面への遷移ハンドラーを追加
    const handleAdditionalShipping = (orderNumber) => {
      navigate(`/shipping/additional/${orderNumber}`);
    };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl">受注管理</h2>
        <div className="flex gap-2">
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">
            <Upload size={18} />
            CSV取込
            <input
              type="file"
              className="hidden"
              accept=".csv"
              onChange={handleFileUpload}
            />
          </label>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={() => console.log('Refresh clicked')}
          >
            <RefreshCw size={18} />
            更新
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">受注番号</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">受注日</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">納期</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">状態</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">アクション</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.jyutyu_no} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm">{order.jyutyu_no}</td>
                  <td className="px-6 py-3 text-sm">{order.jyutyu_date}</td>
                  <td className="px-6 py-3 text-sm">{order.noki}</td>
                  <td className="px-6 py-3 text-sm">{order.status}</td>
                  <td className="px-6 py-3 text-sm">
                    <button
                      className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                      onClick={() => handleShowDetail(order)}
                    >
                      詳細
                    </button>
                    <button
                      className="px-3 py-1 text-sm"
                      onClick={() => handleShipping()} // 修正
                    >
                      出荷
                    </button>
                    <button
                      className="px-3 py-1 text-sm text-yellow-600 hover:bg-yellow-50 rounded ml-2"
                      onClick={() => handleAdditionalShipping(order.jyutyu_no)} // 修正
                    >
                      追加出荷
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailModal 
          order={selectedOrder} 
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default OrderManagement;