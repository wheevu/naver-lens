import { useState, useEffect } from "react";
import StoreHeader, { type StoreData } from "../components/layout/StoreHeader";
import StoreNavBar from "../components/layout/StoreNavBar";
import { useParams } from "react-router-dom";
import type { Product } from "../types/product";
import ProductPurchasePanel from "../components/product/ProductPurchasePanel";
import ProductImageGallery from "../components/product/ProductImageGallery";
import axios from "../api/axios";

const storeDataA: StoreData = {
  name: "EDGEHOME",
  followers: 349358,
  avatarUrl: "https://placehold.co/84x84/111111/FFFFFF?text=Edge",
  themeColor: "#5f46f3",
  buttonColor: "#5f46f3",
};
const storeDataB: StoreData = {
  name: "드림마켓",
  followers: 231477,
  avatarUrl: "https://placehold.co/84x84/111111/FFFFFF?text=Dream",
  themeColor: "#FFFFFF",
  buttonColor: "#FEE500",
};

const StorePage = () => {
  const { productId } = useParams<{ productId: string }>();
  const [store, setStore] = useState<StoreData>(storeDataA);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div
        className="app-container flex items-center justify-center text-white text-2xl"
        style={{ height: "100vh", minHeight: "100vh" }}
      >
        Đang tải sản phẩm...
      </div>
    );
  }

  if (!product) {
    return (
      <div
        className="app-container flex items-center justify-center text-white text-2xl"
        style={{ height: "100vh", minHeight: "100vh" }}
      >
        Không tìm thấy sản phẩm.
      </div>
    );
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
          className="text-white mt-12 border-t pt-8"
          style={{ borderColor: "var(--glass-border)" }}
        >
          <h3 className="text-2xl font-bold mb-4">Mô tả sản phẩm</h3>
          <p className="text-gray-300 whitespace-pre-line">
            {product.description}
          </p>
        </div>
      </main>
    </div>
  );
};

export default StorePage;
