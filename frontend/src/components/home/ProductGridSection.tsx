import { useEffect, useState } from "react";
import Pagination from "../common/Pagination";
import ProductCard, { type ProductCardProps } from "../common/ProductCard";
import axios from "../../api/axios";

// Korean UI → English API value
const categoryMap: Record<string, string> = {
  "디지털/가전": "Electronics",
  "생활/건강": "Health",
  "가구/인테리어": "Furniture",
  "스포츠/레저": "Sports",
  식품: "Food",
  "출산/육아": "Kids",
  패션의류: "Fashion",
  "화장품/미용": "Beauty",
  여행: "Travel",
  사무용품: "Office",
  자동차: "Automotive",
  반려동물: "Pet",
  가구: "Furniture",
} as const;

type KoreanCategory = keyof typeof categoryMap;
const koreanCategories = Object.keys(categoryMap) as KoreanCategory[];

// API types
interface ApiProduct {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  originalPrice: number;
  brand: string;
  mallName: string;
  rating: number;
  reviewCount: number;
  categories: {
    category1: string;
    category2: string;
    category3: string;
    category4: string;
  };
  descriptionPreview: string;
}

interface ApiResponse {
  data: ApiProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Mapper
const mapApiToCardProps = (item: ApiProduct): ProductCardProps => {
  const finalPrice = item.price;
  const originalPrice = item.originalPrice > 0 ? item.originalPrice : undefined;
  const discountRate =
    originalPrice && finalPrice < originalPrice
      ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
      : undefined;

  return {
    id: item.id,
    name: item.name.replace(/<b>|<\/b>/g, ""),
    imageUrl: item.imageUrl,
    tag: undefined,
    finalPrice,
    originalPrice,
    discountRate,
  };
};

const ProductGridSection = () => {
  const [catIdx, setCatIdx] = useState(0);
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<ApiProduct[]>([]);
  const [displayed, setDisplayed] = useState<ProductCardProps[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const selectedKorean = koreanCategories[catIdx];
  const selectedEnglish = categoryMap[selectedKorean];
  const ITEMS_PER_PAGE = 12;

  // 1. Load **all** products once
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        const res = await axios.get<ApiResponse>("/api/products");
        setAllProducts(res.data.data);
      } catch (err) {
        console.error("load all error:", err);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  // 2. Filter + paginate whenever category or page changes
  useEffect(() => {
    const filtered = allProducts.filter(
      (p) => p.categories.category1 === selectedEnglish
    );

    const total = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    setTotalPages(total || 1);

    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageItems = filtered.slice(start, end).map(mapApiToCardProps);

    setDisplayed(pageItems);
    // reset page if it exceeds new total
    if (page > total && total > 0) setPage(total);
  }, [allProducts, catIdx, page, selectedEnglish]);

  const handleCategory = (idx: number) => {
    setCatIdx(idx);
    setPage(1); // always start at page 1 for new category
  };
  const handlePage = (p: number) => setPage(p);

  return (
    <div className="w-full py-10" style={{ fontFamily: "var(--font-secondary)" }}>
      <div className="mb-1.5">
        <h3 className="text-2xl font-bold">
          <span style={{ color: "var(--naver-green)" }}>{selectedKorean}</span>
          <span className="text-white"> 상품 어떠세요?</span>
        </h3>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto py-4">
        {koreanCategories.map((kor, idx) => {
          const active = idx === catIdx;
          return (
            <button
              key={kor}
              onClick={() => handleCategory(idx)}
              className={`px-3 h-10 rounded-[20px] text-xs font-bold whitespace-nowrap transition-colors ${
                active ? "text-white" : "text-gray-400 hover:text-white"
              }`}
              style={{
                background: active ? "var(--naver-green)" : "var(--glass-bg)",
                border: active ? "none" : "1px solid var(--glass-border)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              {kor}
            </button>
          );
        })}
      </div>

      <div className="relative grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8 pt-4 min-h-[300px]">
        {loading ? (
          <div className="absolute inset-0 flex justify-center items-center">
            <p className="text-white text-lg">Đang tải...</p>
          </div>
        ) : displayed.length === 0 ? (
          <div className="col-span-full text-center text-gray-400">
            이 카테고리에 상품이 없습니다.
          </div>
        ) : (
          displayed.map((p) => <ProductCard key={p.id} {...p} />)
        )}

        <div
          className="absolute left-0 bottom-0 mb-4 ml-4 px-1.5 py-0.5 rounded-md text-xs font-bold"
          style={{
            background: "var(--glass-bg)",
            color: "var(--naver-gray-light)",
            border: "1px solid var(--glass-border)",
          }}
        >
          AD
        </div>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePage}
        />
      )}
    </div>
  );
};

export default ProductGridSection;