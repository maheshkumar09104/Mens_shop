import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaHeart, FaMinus, FaPlus, FaRegHeart, FaStar } from "react-icons/fa";
import api from "../services/api";
import useAuthStore from "../store/authStore";
import useCartStore from "../store/cartStore";
import ProductCard from "../components/ProductCard";
import formatCurrency from "../utils/formatCurrency";

const placeholderImage = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900";

function StarRating({ value = 0, onChange, size = "text-lg" }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= value;
        const Tag = onChange ? "button" : "span";

        return (
          <Tag
            key={star}
            type={onChange ? "button" : undefined}
            onClick={onChange ? () => onChange(star) : undefined}
            className={`${size} ${active ? "text-[#c9a84c]" : "text-slate-300"} ${
              onChange ? "transition hover:text-[#c9a84c]" : ""
            }`}
            aria-label={onChange ? `${star} stars` : undefined}
          >
            <FaStar />
          </Tag>
        );
      })}
    </div>
  );
}

function ProductDetailPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const addToCart = useCartStore((state) => state.addToCart);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewing, setReviewing] = useState(false);

  const isWishlisted = useMemo(() => wishlist.some((item) => item._id === id), [wishlist, id]);
  const rating = Number(product?.avgRating ?? product?.ratings ?? 0);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);

      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        setQuantity(1);

        if (data.category) {
          const related = await api.get("/products", { params: { category: data.category } });
          setRelatedProducts(related.data.filter((item) => item._id !== data._id).slice(0, 3));
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    setWishlist(JSON.parse(localStorage.getItem("mensShopWishlist") || "[]"));
  }, []);

  const handleQuantity = (nextQuantity) => {
    const maxStock = Math.max(Number(product?.stock || 1), 1);
    setQuantity(Math.min(Math.max(nextQuantity, 1), maxStock));
  };

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = () => {
    setWishlist((current) => {
      const exists = current.some((item) => item._id === product._id);
      const updated = exists ? current.filter((item) => item._id !== product._id) : [...current, product];

      localStorage.setItem("mensShopWishlist", JSON.stringify(updated));
      toast.success(exists ? "Removed from wishlist" : "Added to wishlist");
      return updated;
    });
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    setReviewing(true);

    try {
      const { data } = await api.post(`/products/${id}/review`, {
        rating: reviewRating,
        comment: reviewComment
      });

      setProduct(data);
      setReviewComment("");
      setReviewRating(5);
      toast.success("Review submitted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to submit review");
    } finally {
      setReviewing(false);
    }
  };

  if (loading) {
    return <div className="py-10 text-center font-bold text-[#1a2e4a]">Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h1 className="text-2xl font-black text-[#1a2e4a]">Product not found</h1>
        <Link to="/products" className="mt-5 inline-flex rounded-md bg-[#1a2e4a] px-5 py-3 font-bold text-white">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <section className="space-y-8 px-1 sm:px-0">
      <div className="grid gap-8 rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[minmax(0,1fr)_420px] lg:p-6">
        <div className="overflow-hidden rounded-lg bg-slate-100">
          <img src={product.image || placeholderImage} alt={product.name} className="h-full min-h-[320px] w-full object-cover" />
        </div>

        <div className="flex flex-col">
          <span className="w-fit rounded-full bg-[#c9a84c]/20 px-3 py-1 text-xs font-black uppercase tracking-wide text-[#1a2e4a]">
            {product.category || "Menswear"}
          </span>
          <h1 className="mt-4 text-3xl font-black text-[#1a2e4a] sm:text-4xl">{product.name}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <StarRating value={Math.round(rating)} />
            <span className="text-sm font-bold text-slate-600">
              {rating.toFixed(1)} ({product.numReviews || 0} reviews)
            </span>
          </div>

          <p className="mt-5 text-3xl font-black text-[#1a2e4a]">{formatCurrency(product.price)}</p>
          <p className={`mt-3 font-bold ${product.stock > 0 ? "text-emerald-700" : "text-red-600"}`}>
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </p>

          <p className="mt-5 leading-7 text-slate-600">
            {product.description || "A classic menswear essential designed for daily polish and comfort."}
          </p>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex h-11 items-center overflow-hidden rounded-md border border-slate-300">
              <button
                type="button"
                onClick={() => handleQuantity(quantity - 1)}
                className="grid h-11 w-11 place-items-center text-[#1a2e4a] hover:bg-slate-100"
                aria-label="Decrease quantity"
              >
                <FaMinus size={12} />
              </button>
              <span className="grid h-11 w-14 place-items-center border-x border-slate-300 font-black text-[#1a2e4a]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => handleQuantity(quantity + 1)}
                className="grid h-11 w-11 place-items-center text-[#1a2e4a] hover:bg-slate-100"
                aria-label="Increase quantity"
              >
                <FaPlus size={12} />
              </button>
            </div>
            <span className="text-sm text-slate-500">{product.stock || 0} available</span>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="rounded-md bg-[#c9a84c] px-5 py-3 font-black text-[#1a2e4a] transition hover:bg-[#d6b85f] disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Add to Cart
            </button>
            <button
              type="button"
              onClick={handleWishlist}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-[#1a2e4a] px-5 py-3 font-bold text-[#1a2e4a] transition hover:bg-[#1a2e4a] hover:text-white"
            >
              {isWishlisted ? <FaHeart /> : <FaRegHeart />} Add to Wishlist
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-black text-[#1a2e4a]">Reviews</h2>

        {user ? (
          <form onSubmit={handleReviewSubmit} className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <label className="text-sm font-bold text-[#1a2e4a]">Your Rating</label>
            <div className="mt-2">
              <StarRating value={reviewRating} onChange={setReviewRating} size="text-2xl" />
            </div>
            <label htmlFor="review-comment" className="mt-4 block text-sm font-bold text-[#1a2e4a]">
              Comment
            </label>
            <textarea
              id="review-comment"
              value={reviewComment}
              onChange={(event) => setReviewComment(event.target.value)}
              required
              rows="4"
              className="mt-2 w-full rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30"
            />
            <button
              type="submit"
              disabled={reviewing}
              className="mt-4 rounded-md bg-[#1a2e4a] px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {reviewing ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        ) : (
          <p className="mt-4 text-slate-600">
            <Link to="/login" className="font-bold text-[#1a2e4a] underline">
              Login
            </Link>{" "}
            to write a review.
          </p>
        )}

        <div className="mt-6 divide-y divide-slate-200">
          {product.reviews?.length > 0 ? (
            product.reviews.map((review) => (
              <article key={review._id || `${review.name}-${review.createdAt}`} className="py-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-black text-[#1a2e4a]">{review.name}</p>
                    <StarRating value={review.rating} />
                  </div>
                  <p className="text-sm text-slate-500">{new Date(review.createdAt).toLocaleDateString("en-IN")}</p>
                </div>
                <p className="mt-3 text-slate-600">{review.comment}</p>
              </article>
            ))
          ) : (
            <p className="py-5 text-slate-600">No reviews yet.</p>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div>
          <h2 className="mb-5 text-2xl font-black text-[#1a2e4a]">Related Products</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default ProductDetailPage;
