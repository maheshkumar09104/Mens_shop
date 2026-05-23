import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import api from "../services/api";

const fallbackProducts = [
  {
    _id: "sample-1",
    name: "Oxford Button-Down Shirt",
    brand: "Northline",
    category: "shirts",
    description: "A crisp cotton shirt cut for workdays, dinners, and weekends.",
    price: 54,
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80",
    rating: 4.7
  },
  {
    _id: "sample-2",
    name: "Slim Dark Denim",
    brand: "Forge",
    category: "jeans",
    description: "Structured stretch denim with a clean dark rinse and tapered leg.",
    price: 78,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80",
    rating: 4.5
  },
  {
    _id: "sample-3",
    name: "Leather Everyday Sneakers",
    brand: "Crest",
    category: "shoes",
    description: "Minimal leather sneakers designed to pair with denim or tailoring.",
    price: 96,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
    rating: 4.8
  }
];

function Products() {
  const [products, setProducts] = useState(fallbackProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");
        setProducts(data.length ? data : fallbackProducts);
      } catch (error) {
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="page-shell py-10">
      <div className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase text-copper">Collection</p>
          <h1 className="text-3xl font-black">Shop Menswear</h1>
        </div>
        {loading && <p className="text-sm font-semibold text-slate-500">Loading products...</p>}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default Products;
