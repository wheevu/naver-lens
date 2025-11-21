import { useState, useEffect } from "react";
import StoreHeader, { type StoreData } from "../components/layout/StoreHeader";
import StoreNavBar from "../components/layout/StoreNavBar";
import { useParams } from "react-router-dom";
import type { Product } from "../types/product";
import ProductPurchasePanel from "../components/product/ProductPurchasePanel";
import ProductImageGallery from "../components/product/ProductImageGallery";
import ProductReviews from "../components/product/ProductReviews";
import axios from "../api/axios";
import NotFound from "./NotFound";

const defaultStoreData: StoreData = {
  name: "Loading...",
  followers: 0,
  avatarUrl: "https://placehold.co/84x84/111111/FFFFFF?text=Store",
};

interface ApiProductResponse {
  _id: string;
  productId: string;
  title: string;
  brand: string;
  maker: string;
  images: string[];
  price: number;
  originalPrice: number;
  mallName: string;
  shipping: string;
  rating: number;
  reviewCount: number;
  options: Array<{ name: string; values: string[] }>;
  description: string;
  category1: string;
  category2: string;
  category3: string;
  category4: string;
  reviews: string[];
  mallColor?: string;
}

const ProductPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const [store, setStore] = useState<StoreData>(defaultStoreData);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      setError(true);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/products/${productId}`);
        const data = response.data as ApiProductResponse;

        const mappedProduct: Product = {
          productId: data.productId,
          title: data.title,
          brand: data.brand,
          maker: data.maker || data.brand,
          images: data.images || [],
          price: data.price,
          originalPrice: data.originalPrice,
          mallName: data.mallName,
          mallColor: data.mallColor,
          shipping: data.shipping,
          rating: data.rating,
          reviewCount: data.reviewCount,
          options: data.options || [],
          description: data.description,
          reviews: data.reviews || [],
          category1: data.category1,
          category2: data.category2,
          category3: data.category3,
          category4: data.category4,
        };

        setProduct(mappedProduct);

        setStore({
          name: data.mallName || "Naver Store",
          followers: Math.floor(Math.random() * 50000) + 1000,
          avatarUrl: `https://placehold.co/84x84/333333/FFFFFF?text=${
            data.mallName?.[0] || "S"
          }`,
          themeColor: data.mallColor,
        });

        setError(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div
        className="app-container flex items-center justify-center text-2xl"
        style={{
          height: "100vh",
          minHeight: "100vh",
          color: "var(--text-primary)",
        }}
      >
        Loading product...
      </div>
    );
  }

  if (error || !product) {
    return <NotFound />;
  }

  return (
    <div
      className="app-container"
      style={{ height: "auto", minHeight: "100vh" }}
    >
      <StoreHeader store={store} loading={loading} />
      <StoreNavBar store={store} loading={loading} />

      <main className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <ProductImageGallery
            images={product.images}
            productTitle={product.title}
          />
          <ProductPurchasePanel product={product} />
        </div>

        <div
          className="mt-12 border-t pt-8"
          style={{
            borderColor: "var(--glass-border)",
            color: "var(--text-primary)",
          }}
        >
          <h3 className="text-2xl font-bold mb-4">상세정보 (Description)</h3>
          <p className="opacity-80 whitespace-pre-line leading-relaxed">
            {product.description}
          </p>
        </div>

        <ProductReviews reviews={product.reviews} />
      </main>
    </div>
  );
};

export default ProductPage;
