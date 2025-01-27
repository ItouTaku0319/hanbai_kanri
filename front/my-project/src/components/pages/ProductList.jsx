import React, { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import Form from "../common/Form"; // 🔹 共通フォームをインポート

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
  });
  const [isFormVisible, setIsFormVisible] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8080/inventory");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      if (response.ok) {
        fetchProducts();
        setNewProduct({ name: "", description: "", price: 0, stock: 0 });
        setIsFormVisible(false);
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/products/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">商品一覧</h1>
        <button
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <Plus size={20} />
          商品を追加
        </button>
      </div>

      {/* 共通フォームの適用 */}
      {isFormVisible && (
        <Form
          fields={[
            { label: "商品名", name: "name", type: "text" },
            { label: "説明", name: "description", type: "text" },
            { label: "価格", name: "price", type: "number" },
            { label: "在庫数", name: "stock", type: "number" },
          ]}
          formData={newProduct}
          setFormData={setNewProduct}
          onSubmit={handleSubmit}
          onCancel={() => setIsFormVisible(false)}
        />
      )}

      {/* 商品一覧表示 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">{product.name}</h2>
                <p className="text-gray-600 mt-1">{product.description}</p>
              </div>
              <button
                onClick={() => handleDelete(product.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 size={20} />
              </button>
            </div>
            <div className="mt-4 space-y-1">
              <p className="text-gray-700">価格: ¥{product.price.toLocaleString()}</p>
              <p className="text-gray-700">在庫: {product.stock}個</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
