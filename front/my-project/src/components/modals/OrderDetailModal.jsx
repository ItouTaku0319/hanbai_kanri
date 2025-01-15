// src/components/modals/OrderDetailModal.jsx
import React from 'react';
import { X, AlertCircle } from 'lucide-react';

const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;

  // 仮のデータ（後でAPIから取得するデータ）
  const productMaterials = {
    '鉄の剣': [
      { sozai: '鉄インゴット', required: 3 },
      { sozai: '革紐', required: 1 }
    ],
    '銅の盾': [
      { sozai: '銅インゴット', required: 4 },
      { sozai: '革', required: 2 }
    ]
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        {/* ヘッダー */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">受注詳細：{order.jyutyu_no}</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* 基本情報 */}
        <div className="p-4 border-b">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">受注番号</p>
              <p className="font-medium">{order.jyutyu_no}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">受注日</p>
              <p className="font-medium">{order.jyutyu_date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">納期</p>
              <p className="font-medium">{order.noki}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">状態</p>
              <p className="font-medium">{order.status}</p>
            </div>
          </div>
        </div>

        {/* 受注明細 */}
        <div className="p-4 space-y-4">
          <h4 className="text-md font-semibold">受注明細</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">商品</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">受注数</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">必要素材</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{item.syohin}</td>
                    <td className="px-4 py-2">{item.jyutyu_su}</td>
                    <td className="px-4 py-2">
                      {productMaterials[item.syohin] ? (
                        <div className="space-y-1">
                          {productMaterials[item.syohin].map((material, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <span>{material.sozai}</span>
                              <span className="text-gray-500">
                                × {material.required * item.jyutyu_su}個
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                          <AlertCircle size={16} />
                          <span>素材情報なし</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* フッター */}
        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;