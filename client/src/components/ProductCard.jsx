import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaCartPlus, FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import useCartStore from "../store/cartStore";

function ProductCard({ product, isWishlisted = false, onToggleWishlist }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const imageUrl =
    product.image ||
    "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=900&q=80";

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = () => {
    onToggleWishlist?.(product);
  };

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] bg-slate-100">
        <Link to={`/products/${product._id}`}>
          <img src={imageUrl} alt={product.name} className="h-full w-full object-cover" />
        </Link>
        <button
          type="button"
          onClick={handleWishlist}
          className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full border border-[#c9a84c]/40 bg-white text-[#1a2e4a] shadow-sm transition hover:border-[#c9a84c] hover:text-[#c9a84c]"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWishlisted ? <FaHeart className="text-[#c9a84c]" /> : <FaRegHeart />}
        </button>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#c9a84c]">
            {product.category || "Menswear"}
          </p>
          <Link to={`/products/${product._id}`}>
            <h3 className="mt-1 line-clamp-2 text-lg font-black text-[#1a2e4a] transition hover:text-[#c9a84c]">
              {product.name}
            </h3>
          </Link>
        </div>

        <p className="line-clamp-2 min-h-10 text-sm leading-5 text-slate-600">
          {product.description || "Classic wardrobe essential for a polished everyday look."}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-black text-[#1a2e4a]">${Number(product.price || 0).toFixed(2)}</span>
          <span className="flex items-center gap-1 text-sm font-bold text-[#c9a84c]">
            <FaStar /> {product.ratings || 0}
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-[#1a2e4a] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#233d62] disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          <FaCartPlus /> {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
