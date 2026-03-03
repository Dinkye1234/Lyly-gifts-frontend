import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:8000/api/product";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    about: "",
    image: null,
    featured: false,
  });
  const [editingProduct, setEditingProduct] = useState(null); // Засах бүтээгдэхүүн

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get(API);
    setProducts(res.data);
  };

  const handleFileChange = (e) => {
    setNewProduct({ ...newProduct, image: e.target.files[0] });
  };

  // Шинэ бүтээгдэхүүн нэмэх
  const addProduct = async () => {
    if (
      !newProduct.name ||
      !newProduct.price ||
      !newProduct.image ||
      !newProduct.category ||
      !newProduct.about
    )
      return alert("Бүх талбарыг бөглөнө үү!");

    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("price", newProduct.price);
      formData.append("category", newProduct.category);
      formData.append("about", newProduct.about);
      formData.append("image", newProduct.image);
      formData.append("featured", newProduct.featured);

      const res = await axios.post(`${API}/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProducts([...products, res.data.product]);
      alert(res.data.msg || "Амжилттай хадгаллаа");

      setNewProduct({
        name: "",
        price: "",
        category: "",
        about: "",
        image: null,
        featured: false,
      });
    } catch (err) {
      console.error(err);
      alert("Бүтээгдэхүүн хадгалахад алдаа гарлаа");
    }
  };

  // Бүтээгдэхүүн устгах
  const deleteProduct = async (id) => {
    await axios.delete(`${API}/${id}`);
    setProducts(products.filter((p) => p._id !== id));
  };

  // Засах товч дарсан үед
  const startEditing = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price,
      category: product.category,
      about: product.about,
      image: product.image,
      featured: product.featured,
    });
  };

  // Зассан бүтээгдэхүүнийг серверт хадгалах
  const saveEdit = async () => {
    if (!editingProduct) return;

    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("price", newProduct.price);
      formData.append("category", newProduct.category);
      formData.append("about", newProduct.about);
      if (newProduct.image instanceof File) {
        formData.append("image", newProduct.image);
      }
      formData.append("featured", newProduct.featured);

      const res = await axios.patch(`${API}/${editingProduct._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProducts(
        products.map((p) =>
          p._id === editingProduct._id ? res.data.product : p
        )
      );
      alert("Амжилттай шинэчиллээ");

      setEditingProduct(null);
      setNewProduct({
        name: "",
        price: "",
        category: "",
        about: "",
        image: null,
        featured: false,
      });
    } catch (err) {
      console.error(err);
      alert("Шинэчлэхэд алдаа гарлаа");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Бүтээгдэхүүн удирдах</h1>

      {/* Add/Edit form */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-3">
          {editingProduct ? "Бүтээгдэхүүн засах" : "Шинэ бүтээгдэхүүн нэмэх"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Нэр"
            className="border p-2 rounded-lg"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Үнэ"
            className="border p-2 rounded-lg"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
          />
          <select
            className="border p-2 rounded-lg"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
          >
            <option value="">Категори сонгох</option>
            <option value="Валентины багц">Валентины багц</option>
            <option value="Төрсөн өдөр">Төрсөн өдөр</option>
            <option value="Өөрийгөө энхрийлэх">Өөрийгөө энхрийлэх</option>
            <option value="Ойн баяр">Ойн баяр</option>
            <option value="Гэрлэлтийн бэлэг">Гэрлэлтийн бэлэг</option>
            <option value="Хайртдаа бэлэг">Хайртдаа бэлэг</option>
          </select>
          <input
            type="text"
            placeholder="Бүтээгдэхүүний тухай"
            className="border p-2 rounded-lg"
            value={newProduct.about}
            onChange={(e) =>
              setNewProduct({ ...newProduct, about: e.target.value })
            }
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border p-2 rounded-lg"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newProduct.featured}
              onChange={(e) =>
                setNewProduct({ ...newProduct, featured: e.target.checked })
              }
              className="w-4 h-4"
            />
            Онцгой бэлэг
          </label>
        </div>

        {newProduct.image && (
          <div className="mt-2">
            <img
              src={
                typeof newProduct.image === "string"
                  ? newProduct.image
                  : URL.createObjectURL(newProduct.image)
              }
              alt="preview"
              className="w-20 h-20 object-cover rounded-lg"
            />
          </div>
        )}

        <button
          onClick={editingProduct ? saveEdit : addProduct}
          className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          {editingProduct ? "Хадгалах" : "Нэмэх"}
        </button>
        {editingProduct && (
          <button
            onClick={() => {
              setEditingProduct(null);
              setNewProduct({
                name: "",
                price: "",
                category: "",
                about: "",
                image: null,
                featured: false,
              });
            }}
            className="mt-4 ml-2 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
          >
            Цуцлах
          </button>
        )}
      </div>

      {/* Product List */}
      <div className="overflow-x-auto rounded-lg shadow md-6">
        <table className="w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Зураг</th>
              <th className="p-2 border">Нэр</th>
              <th className="p-2 border">Үнэ</th>
              <th className="p-2 border">Категори</th>
              <th className="p-2 border">Бүтээгдэхүүний тухай</th>
              <th className="p-2 border">Огноо</th>
              <th className="p-2 border">Үйлдэл</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="text-center">
                <td className="p-2 border">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-16 h-16 mx-auto rounded-lg"
                  />
                </td>
                <td className="p-2 border">{p.name}</td>
                <td className="p-2 border">{p.price}₮</td>
                <td className="p-2 border">{p.category}</td>
                <td className="p-2 border">{p.about}</td>
                <td className="p-2 border">
                  {new Date(p.saledate).toLocaleString()}
                </td>
                <td className="p-2 border flex flex-col gap-1">
                  <button
                    onClick={() => startEditing(p)}
                    className="text-blue-500 hover:underline"
                  >
                    Засах
                  </button>
                  <button
                    onClick={() => deleteProduct(p._id)}
                    className="text-red-500 hover:underline"
                  >
                    Устгах
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
