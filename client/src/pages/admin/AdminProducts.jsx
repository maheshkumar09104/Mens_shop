import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaEdit, FaPlus, FaTimes, FaTrash } from "react-icons/fa";
import api from "../../services/api";
import AdminLayout from "./AdminLayout";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "T-Shirts",
  image: "",
  stock: 0
};

const categories = ["T-Shirts", "Shirts", "Pants", "Shoes", "Accessories"];

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products");
      setProducts(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category || "T-Shirts",
      image: product.image || "",
      stock: product.stock || 0
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData(emptyForm);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock)
    };

    try {
      if (editingProduct) {
        const { data } = await api.put(`/products/${editingProduct._id}`, payload);
        setProducts((current) => current.map((product) => (product._id === data._id ? data : product)));
        toast.success("Product updated");
      } else {
        const { data } = await api.post("/products", payload);
        setProducts((current) => [data, ...current]);
        toast.success("Product added");
      }

      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this product?");

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/products/${id}`);
      setProducts((current) => current.filter((product) => product._id !== id));
      toast.success("Product deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete product");
    }
  };

  return (
    <AdminLayout title="Products" subtitle="Create, update, and remove menswear catalog items.">
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-black text-[#1a2e4a]">Product Catalog</h2>
            <p className="mt-1 text-sm text-slate-600">{loading ? "Loading..." : `${products.length} products`}</p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1a2e4a] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#233d62]"
          >
            <FaPlus /> Add Product
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
              <tr>
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Stock</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="px-5 py-4 font-bold text-[#1a2e4a]">{product.name}</td>
                  <td className="px-5 py-4">${Number(product.price || 0).toFixed(2)}</td>
                  <td className="px-5 py-4">{product.category}</td>
                  <td className="px-5 py-4">{product.stock}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(product)}
                        className="inline-flex items-center gap-2 rounded-md border border-[#c9a84c] px-3 py-2 font-bold text-[#1a2e4a] transition hover:bg-[#c9a84c]"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product._id)}
                        className="inline-flex items-center gap-2 rounded-md border border-red-200 px-3 py-2 font-bold text-red-600 transition hover:bg-red-50"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <h2 className="text-xl font-black text-[#1a2e4a]">
                {editingProduct ? "Edit Product" : "Add Product"}
              </h2>
              <button type="button" onClick={closeModal} className="text-slate-500 hover:text-[#1a2e4a]">
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 p-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-[#1a2e4a]" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-[#1a2e4a]" htmlFor="price">
                  Price
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-[#1a2e4a]" htmlFor="stock">
                  Stock
                </label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-[#1a2e4a]" htmlFor="category">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-bold text-[#1a2e4a]" htmlFor="image">
                  Image URL
                </label>
                <input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-bold text-[#1a2e4a]" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="mt-2 w-full rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30"
                />
              </div>

              <div className="flex justify-end gap-3 md:col-span-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md border border-slate-300 px-5 py-3 font-bold text-[#1a2e4a]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-md bg-[#c9a84c] px-5 py-3 font-black text-[#1a2e4a] transition hover:bg-[#d6b85f] disabled:opacity-70"
                >
                  {saving ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminProducts;
