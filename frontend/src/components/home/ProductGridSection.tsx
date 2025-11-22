// src/components/home/ProductGridSection.tsx
import { useEffect, useState } from "react";
import Pagination from "../common/Pagination";
import ProductCard, { type ProductCardProps } from "../common/ProductCard";
import axios from "../../api/axios";
import { useTranslation } from "react-i18next";

// 1. Định nghĩa cấu hình danh mục
// Key: dùng để dịch đa ngôn ngữ (i18n)
// apiValue: giá trị chính xác để gửi lên BE (phải khớp với DB)
const CATEGORY_CONFIG = [
  { key: "furniture", apiValue: "Home" }, // DB: category1="Home"
  { key: "digital", apiValue: "Electronics" }, // DB: category1="Electronics"
  { key: "living", apiValue: "Health" }, // DB: category1="Health" (Giả định)
  { key: "sports", apiValue: "Sports" }, // DB: category1="Sports" (Giả định)
  { key: "food", apiValue: "Food" }, // DB: category1="Food"
  { key: "kids", apiValue: "Kids" }, // DB: category1="Kids"
  { key: "fashionClothing", apiValue: "Fashion" }, // DB: category1="Fashion"
  { key: "fashionAccessories", apiValue: "Fashion" }, // DB: category1="Fashion"
  { key: "beauty", apiValue: "Beauty" }, // DB: category1="Beauty"
];

// Interface cho dữ liệu từ API (khớp với transformProduct trong BE)
interface ApiProductItem {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  originalPrice: number;
  brand: string;
  mallName: string;
  rating: number;
  reviewCount: number;
  // categories object từ BE
  categories: {
    category1: string;
    category2: string;
    category3: string;
    category4: string;
  };
  descriptionPreview: string;
}

// Hàm chuyển đổi dữ liệu
const mapApiToCardProps = (item: ApiProductItem): ProductCardProps => {
  const finalPrice = item.price;
  const originalPrice = item.originalPrice;

  const discountRate =
    originalPrice > 0 && finalPrice < originalPrice
      ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
      : undefined;

  return {
    id: item.id,
    name: item.name, // BE đã strip HTML rồi
    imageUrl: item.imageUrl,
    tag: item.brand,
    finalPrice,
    originalPrice: originalPrice > 0 ? originalPrice : undefined,
    discountRate,
  };
};

const ITEMS_PER_PAGE = 12;

const ProductGridSection = () => {
  const { t } = useTranslation();

  // State lưu 'key' của danh mục đang chọn
  const [activeCategoryKey, setActiveCategoryKey] = useState(
    CATEGORY_CONFIG[0].key
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // 2. Tìm giá trị API tương ứng với key đang chọn
        const currentConfig = CATEGORY_CONFIG.find(
          (c) => c.key === activeCategoryKey
        );
        const apiCategoryValue = currentConfig
          ? currentConfig.apiValue
          : "Home";

        // 3. Gọi API với tham số lọc Server-side
        // Lưu ý: Dùng 'category1' thay vì 'category' để khớp với logic applyFilters trong BE
        const response = await axios.get("/api/products", {
          params: {
            category1: apiCategoryValue, // Lọc theo category1
            page: currentPage,
            limit: ITEMS_PER_PAGE,
          },
        });

        // 4. Cập nhật dữ liệu từ response chuẩn của BE
        // Response BE: { data: [...], pagination: {...} }
        if (response.data && response.data.data) {
          setProducts(response.data.data.map(mapApiToCardProps));
          setTotalPages(response.data.pagination.totalPages);
        } else {
          // Fallback nếu response rỗng
          setProducts([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategoryKey, currentPage]);

  const handleCategoryChange = (key: string) => {
    setActiveCategoryKey(key);
    setCurrentPage(1); // Reset về trang 1 khi đổi danh mục
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div
      className="w-full py-10"
      style={{ fontFamily: "var(--font-secondary)" }}
    >
      <div className="mb-1.5">
        <h3 className="text-2xl font-bold">
          <span style={{ color: "var(--naver-green)" }}>
            {t(`categories.${activeCategoryKey}`)}
          </span>
          <span className="text-(--text-primary)">
            {" "}
            {t("home.categoryProductsTitle")}
          </span>
        </h3>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto py-4">
        {CATEGORY_CONFIG.map((config) => {
          const isActive = config.key === activeCategoryKey;
          return (
            <button
              key={config.key}
              onClick={() => handleCategoryChange(config.key)}
              className={`px-3 h-10 rounded-[20px] text-xs font-bold whitespace-nowrap transition-colors ${
                isActive
                  ? "text-white"
                  : "text-gray-400 hover:text-(--text-primary)"
              }`}
              style={{
                background: isActive ? "var(--naver-green)" : "var(--glass-bg)",
                border: isActive ? "none" : "1px solid var(--glass-border)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              {t(`categories.${config.key}`)}
            </button>
          );
        })}
      </div>

      <div className="relative grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8 pt-4 min-h-[300px]">
        {loading ? (
          <div className="absolute inset-0 flex justify-center items-center">
            <p className="text-(--text-primary) text-lg">
              {t("common.loading")}
            </p>
          </div>
        ) : products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))
        ) : (
          <div className="col-span-full flex justify-center items-center h-40">
            <p className="text-(--text-secondary)">{t("common.noProducts")}</p>
          </div>
        )}
        <div
          className="absolute left-0 bottom-0 mb-4 ml-4 px-1.5 py-0.5 rounded-md text-xs font-bold"
          style={{
            background: "var(--glass-bg)",
            color: "var(--text-muted)",
            border: "1px solid var(--glass-border)",
          }}
        >
          {t("common.ad")}
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ProductGridSection;
