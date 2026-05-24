import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { FaEdit, FaImage, FaPlus, FaTimes, FaTrash } from "react-icons/fa";
import api from "../../services/api";
import useAuthStore from "../../store/authStore";
import AdminLayout from "./AdminLayout";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "T-Shirts",
  stock: 0,
  imageFile: null,
  imagePreview: ""
};

const categories = ["T-Shirts", "Shirts", "Pants", "Shoes", "Accessories"];

function AdminProducts() {
  const token = useAuthStore((state) => state.token);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const authHeaders = useMemo(
    () => ({
      Authorization: token ? `Bearer ${token}` : undefined
    }),
    [token]
  );

  const getImageUrl = (image) => {
    if (!image) {
      return "";
    }

    if (image.startsWith("http")) {
      return image;
    }

    const apiOrigin = (import.meta.env.VITE_API_URL || "https://mens-shop-1.onrender.com").replace(/\/$/, "");
    return `${apiOrigin}${image.startsWith("/") ? image : `/${image}`}`;
  };

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const { data } = await api.get("/products", {
        headers: authHeaders
      });
      setProducts(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [token]);

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
      stock: product.stock || 0,
      imageFile: null,
      imagePreview: getImageUrl(product.image)
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

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setFormData((current) => ({
      ...current,
      imageFile: file,
      imagePreview: URL.createObjectURL(file)
    }));
  };

  const buildProductFormData = () => {
    const productFormData = new FormData();

    productFormData.append("name", formData.name);
    productFormData.append("description", formData.description);
    productFormData.append("price", formData.price);
    productFormData.append("category", formData.category);
    productFormData.append("stock", formData.stock);

    if (formData.imageFile) {
      productFormData.append("image", formData.imageFile);
    }

    return productFormData;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const requestConfig = {
        headers: {
          ...authHeaders,
          "Content-Type": "multipart/form-data"
        }
      };

      if (editingProduct) {
        const { data } = await api.put(`/products/${editingProduct._id}`, buildProductFormData(), requestConfig);
        setProducts((current) => current.map((product) => (product._id === data._id ? data : product)));
        toast.success("Product updated successfully");
      } else {
        const { data } = await api.post("/products", buildProductFormData(), requestConfig);
        setProducts((current) => [data, ...current]);
        toast.success("Product added successfully");
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
      await api.delete(`/products/${id}`, {
        headers: authHeaders
      });
      setProducts((current) => current.filter((product) => product._id !== id));
      toast.success("Product deleted successfully");
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
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
              <tr>
                <th className="px-5 py-4">Image</th>
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Stock</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="px-5 py-4">
                    {product.image ? (
                      <img
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                    ) : (
                      <div className="grid h-16 w-16 place-items-center rounded-md bg-slate-100 text-slate-400">
                        <FaImage />
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 font-bold text-[#1a2e4a]">{product.name}</td>
                  <td className="px-5 py-4">{product.category}</td>
                  <td className="px-5 py-4">${Number(product.price || 0).toFixed(2)}</td>
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

              {!loading && products.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-5 py-10 text-center text-slate-600">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-xl">
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
                  Product Name
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
                <label className="text-sm font-bold text-[#1a2e4a]" htmlFor="stock">
                  Stock Quantity
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
                <label className="text-sm font-bold text-[#1a2e4a]" htmlFor="image">
                  Image Upload
                </label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleImageChange}
                  className="mt-2 w-full rounded-md border border-slate-300 px-4 py-3 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-[#1a2e4a] file:px-3 file:py-2 file:font-bold file:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <p className="text-sm font-bold text-[#1a2e4a]">Image Preview</p>
                <div className="mt-2 grid min-h-48 place-items-center rounded-lg border border-dashed border-slate-300 bg-slate-50">
                  {formData.imagePreview ? (
                    <img
                      src={formData.imagePreview}
                      alt="Product preview"
                      className="max-h-72 w-full rounded-lg object-contain p-3"
                    />
                  ) : (
                    <div className="text-center text-slate-500">
                      <FaImage className="mx-auto mb-2" size={28} />
                      Select an image to preview it before upload.
                    </div>
                  )}
                </div>
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
                  className="rounded-md bg-[#c9a84c] px-5 py-3 font-black text-[#1a2e4a] transition hover:bg-[#d6b85f] disabled:cursor-not-allowed disabled:opacity-70"
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
