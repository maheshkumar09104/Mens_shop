import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import ProductCard from "../components/ProductCard.jsx";
import api from "../services/api";
import { FaFilter } from "react-icons/fa";

const categories = ["T-Shirts", "Shirts", "Pants", "Shoes", "Accessories"];

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const wishlistIds = useMemo(() => wishlist.map((item) => item._id), [wishlist]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const params = {};

        if (selectedCategory) {
          params.category = selectedCategory;
        }

        if (search.trim()) {
          params.search = search.trim();
        }

        if (sort) {
          params.sort = sort;
        }

        const { data } = await api.get("/products", { params });
        setProducts(data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, search, sort]);

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("mensShopWishlist") || "[]");
    setWishlist(storedWishlist);
  }, []);

  const toggleWishlist = (product) => {
    setWishlist((current) => {
      const exists = current.some((item) => item._id === product._id);
      const updatedWishlist = exists
        ? current.filter((item) => item._id !== product._id)
        : [...current, product];

      localStorage.setItem("mensShopWishlist", JSON.stringify(updatedWishlist));
      toast.success(exists ? "Removed from wishlist" : "Added to wishlist");
      return updatedWishlist;
    });
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSearch("");
    setSort("");
  };

  return (
    <section className="space-y-6 px-1 sm:px-0">
      <div className="rounded-lg bg-[#1a2e4a] px-4 py-7 text-white shadow-sm sm:px-6 sm:py-8">
        <p className="text-sm font-bold uppercase tracking-wide text-[#c9a84c]">Mens Shop Collection</p>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-black sm:text-3xl md:text-4xl">Products</h1>
            <p className="mt-2 max-w-2xl text-white/75">
              Browse polished essentials with classic styling, sharp details, and everyday comfort.
            </p>
          </div>
          <div className="w-full lg:w-80">
            <label htmlFor="product-search" className="sr-only">
              Search products
            </label>
            <input
              id="product-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
              className="w-full rounded-md border border-white/20 bg-white px-4 py-3 text-[#1a2e4a] outline-none transition placeholder:text-slate-400 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/40"
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setFiltersOpen((current) => !current)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-[#1a2e4a] bg-white px-4 py-3 font-bold text-[#1a2e4a] shadow-sm lg:hidden"
      >
        <FaFilter /> {filtersOpen ? "Hide Filters" : "Show Filters"}
      </button>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside
          className={`h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm ${
            filtersOpen ? "block" : "hidden"
          } lg:block`}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-[#1a2e4a]">Filters</h2>
            <button type="button" onClick={clearFilters} className="text-sm font-bold text-[#c9a84c]">
              Clear
            </button>
          </div>

          <div className="mt-6">
            <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Category</p>
            <div className="mt-3 space-y-2">
              {categories.map((category) => (
                <label
                  key={category}
                  className="flex cursor-pointer items-center gap-3 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-[#1a2e4a] transition hover:border-[#c9a84c]"
                >
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === category}
                    onChange={() => setSelectedCategory(category)}
                    className="h-4 w-4 accent-[#c9a84c]"
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="sort-products" className="text-sm font-bold uppercase tracking-wide text-slate-500">
              Sort By
            </label>
            <select
              id="sort-products"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="mt-3 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-[#1a2e4a] outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30"
            >
              <option value="">Newest</option>
              <option value="price_asc">Price Low-High</option>
              <option value="price_desc">Price High-Low</option>
            </select>
          </div>
        </aside>

        <div>
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-600">
              {loading ? "Loading products..." : `${products.length} product${products.length === 1 ? "" : "s"} found`}
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  isWishlisted={wishlistIds.includes(product._id)}
                  onToggleWishlist={toggleWishlist}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
              <h2 className="text-xl font-black text-[#1a2e4a]">No products found</h2>
              <p className="mt-2 text-slate-600">Try adjusting your filters or search term.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProductsPage;
