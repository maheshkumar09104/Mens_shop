import { useParams } from "react-router-dom";
import PagePlaceholder from "./PagePlaceholder.jsx";

function ProductDetailPage() {
  const { id } = useParams();

  return (
    <PagePlaceholder eyebrow="Product Details" title="Product Detail Page">
      Product information, image gallery, stock status, wishlist action, and add-to-cart controls for product ID {id}.
    </PagePlaceholder>
  );
}

export default ProductDetailPage;
