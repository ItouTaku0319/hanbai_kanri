import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

const ShippingForm = () => {
  // 受注データ（実際はpropsまたはAPI経由で取得）
  const orderData = {
    orderNumber: '001',
    orderDate: '2025-01-14',
    shopName: 'ドワーフの鍛冶屋',
    dueDate: '2025-01-20',
    items: [
      { 
        id: 1, 
        name: '鉄の剣', 
        quantity: 5,
        shippedQuantity: 2, // すでに出荷済みの数量
      },
      { 
        id: 2, 
        name: '銅の盾', 
        quantity: 3,
        shippedQuantity: 0,
      }
    ],
  };

  const [formData, setFormData] = useState({
    orderNumber: orderData.orderNumber,
    shopName: orderData.shopName,
    shippingDate: '',
    shippingMethod: '陸路輸送',
    items: orderData.items.map(item => ({
      ...item,
      currentShipment: 0, // 今回の出荷数
    })),
    region: '',
    notes: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleShipmentChange = (index, value) => {
    const newItems = [...formData.items];
    const item = newItems[index];
    const remainingQuantity = item.quantity - item.shippedQuantity;
    
    // 出荷可能数を超えないようにバリデーション
    const validatedValue = Math.min(Math.max(0, value), remainingQuantity);
    
    item.currentShipment = validatedValue;
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold">出荷登録</h2>
        </div>
        <div className="p-6">
          {/* 受注情報の表示 */}
          <div className="mb-6 p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-500 mb-2">受注情報</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">受注番号：</span>
                <span className="font-medium">{orderData.orderNumber}</span>
              </div>
              <div>
                <span className="text-gray-500">受注日：</span>
                <span className="font-medium">{orderData.orderDate}</span>
              </div>
              <div>
                <span className="text-gray-500">納期：</span>
                <span className="font-medium">{orderData.dueDate}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本情報セクション */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700" htmlFor="shopName">
                  武器店名
                </label>
                <input
                  type="text"
                  id="shopName"
                  name="shopName"
                  value={formData.shopName}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700" htmlFor="shippingDate">
                  出荷予定日
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="shippingDate"
                    name="shippingDate"
                    value={formData.shippingDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <Calendar className="absolute right-2 top-2 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* 配送方法 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700" htmlFor="shippingMethod">
                輸送方法
              </label>
              <select
                id="shippingMethod"
                name="shippingMethod"
                value={formData.shippingMethod}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="陸路輸送">陸路輸送（馬車）</option>
                <option value="空路輸送">空路輸送（グリフォン便）</option>
                <option value="魔法輸送">魔法輸送（テレポート）</option>
                <option value="緊急輸送">緊急輸送（ペガサス特急）</option>
              </select>
            </div>

            {/* 商品明細セクション */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">出荷商品</h3>
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">商品名</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">受注数</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">出荷済</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">残数</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">今回出荷数</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formData.items.map((item, index) => {
                      const remainingQuantity = item.quantity - item.shippedQuantity;
                      return (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.shippedQuantity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{remainingQuantity}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              value={item.currentShipment}
                              onChange={(e) => handleShipmentChange(index, parseInt(e.target.value))}
                              min="0"
                              max={remainingQuantity}
                              className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 配送先情報 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700" htmlFor="region">
                配送先地域
              </label>
              <input
                type="text"
                id="region"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                placeholder="例: エルフの森"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* 備考 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700" htmlFor="notes">
                備考
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="魔物の出没情報や配送時の注意点があれば入力してください"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
              />
            </div>

            {/* 送信ボタン */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                出荷登録
              </button>
            </div>
          </form>

          {/* 成功メッセージ */}
          {showSuccess && (
            <div className="mt-4 p-4 rounded-md bg-green-50 border border-green-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">出荷登録完了</h3>
                  <div className="mt-2 text-sm text-green-700">
                    出荷情報が正常に登録されました。冒険者ギルドに配送を依頼しました。
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShippingForm;