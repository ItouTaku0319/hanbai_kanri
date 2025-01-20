import React, { useState } from 'react';
import { Calendar, Plus, Trash2, AlertCircle } from 'lucide-react';

const AdditionalShippingForm = () => {
  // 元の受注データ（実際はpropsまたはAPI経由で取得）
  const originalOrder = {
    orderNumber: '001',
    orderDate: '2025-01-14',
    shopName: 'ドワーフの鍛冶屋',
    dueDate: '2025-01-20',
    items: [
      { 
        id: 1, 
        name: '鉄の剣', 
        quantity: 5,
        shippedQuantity: 5, // すでに全数出荷済み
      },
      { 
        id: 2, 
        name: '銅の盾', 
        quantity: 3,
        shippedQuantity: 2, // 一部出荷済み
      }
    ],
  };

  const [formData, setFormData] = useState({
    originalOrderNumber: originalOrder.orderNumber,
    additionalOrderNumber: 'ADD-001', // 追加出荷番号
    shopName: originalOrder.shopName,
    shippingDate: '',
    shippingMethod: '陸路輸送',
    items: [],
    region: '',
    urgencyReason: '', // 追加出荷の理由
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

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now(), name: '', quantity: 0 }]
    }));
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">追加出荷登録</h2>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              追加出荷
            </span>
          </div>
        </div>
        <div className="p-6">
          {/* 元の受注情報の表示 */}
          <div className="mb-6 p-4 bg-blue-50 rounded-md border border-blue-200">
            <h3 className="text-sm font-medium text-blue-900 mb-2">元の受注情報</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-600">受注番号：</span>
                <span className="font-medium">{originalOrder.orderNumber}</span>
              </div>
              <div>
                <span className="text-blue-600">受注日：</span>
                <span className="font-medium">{originalOrder.orderDate}</span>
              </div>
              <div>
                <span className="text-blue-600">納期：</span>
                <span className="font-medium">{originalOrder.dueDate}</span>
              </div>
              <div>
                <span className="text-blue-600">既存商品：</span>
                <span className="font-medium">
                  {originalOrder.items.map(item => `${item.name}(${item.shippedQuantity}/${item.quantity})`).join(', ')}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本情報セクション */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  追加出荷番号
                </label>
                <input
                  type="text"
                  value={formData.additionalOrderNumber}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  武器店名
                </label>
                <input
                  type="text"
                  value={formData.shopName}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                  disabled
                />
              </div>
            </div>

            {/* 追加出荷理由 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                追加出荷の理由
              </label>
              <textarea
                name="urgencyReason"
                value={formData.urgencyReason}
                onChange={handleInputChange}
                placeholder="例: ゴブリンの襲撃により在庫が不足したため"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                required
              />
            </div>

            {/* 配送情報セクション */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  出荷予定日
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="shippingDate"
                    value={formData.shippingDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <Calendar className="absolute right-2 top-2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  輸送方法
                </label>
                <select
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
            </div>

            {/* 追加商品セクション */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                  追加出荷商品
                </label>
                <button
                  type="button"
                  onClick={addItem}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus size={16} className="mr-2" />
                  商品追加
                </button>
              </div>
              
              {formData.items.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-md border-2 border-dashed border-gray-300">
                  <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    追加出荷する商品がありません。<br />
                    「商品追加」ボタンから商品を追加してください。
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div key={item.id} className="flex gap-4 items-end p-4 bg-gray-50 rounded-md">
                    <div className="flex-1 space-y-2">
                      <label className="block text-sm font-medium text-gray-700">商品名</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                        placeholder="例: ミスリルの剣"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="w-32 space-y-2">
                      <label className="block text-sm font-medium text-gray-700">数量</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button 
                      type="button"
                      onClick={() => removeItem(index)}
                      className="px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 配送先情報 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                配送先地域
              </label>
              <input
                type="text"
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
              <label className="block text-sm font-medium text-gray-700">
                備考
              </label>
              <textarea
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
                追加出荷登録
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
                  <h3 className="text-sm font-medium text-green-800">追加出荷登録完了</h3>
<div className="mt-2 text-sm text-green-700">
                    追加出荷情報が正常に登録されました。緊急配送隊に依頼しました。
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

export default AdditionalShippingForm;