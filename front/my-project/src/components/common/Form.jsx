import React from "react";

/**
 * 共通フォームコンポーネント
 * 
 * @param {Array} fields - 入力フィールドの配列 (例: [{ label: "商品名", name: "name", type: "text" }])
 * @param {Object} formData - フォームの状態 (useState で管理)
 * @param {Function} setFormData - フォームの状態を更新する関数
 * @param {Function} onSubmit - フォーム送信時の処理
 * @param {Function} onCancel - キャンセル時の処理
 */
const Form = ({ fields, formData, setFormData, onSubmit, onCancel }) => {
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === "number" ? Number(value) : value 
    });
  };

  return (
    <form onSubmit={onSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6 w-full max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field.name} className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className="w-full border rounded p-3 sm:p-2"
            />
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            キャンセル
          </button>
        )}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          保存
        </button>
      </div>
    </form>
  );
};

export default Form;
