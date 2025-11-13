import { useState } from "react";
import Pagination from "../common/Pagination";
import ProductCard, { type ProductCardProps } from "../common/ProductCard";

const categories = [
  "가구/인테리어",
  "디지털/가전",
  "생활/건강",
  "스포츠/레저",
  "식품",
  "출산/육아",
  "패션의류",
  "패션잡화",
  "화장품/미용",
];

const allProductPages: Record<number, ProductCardProps[]> = {
  1: [
    {
      id: "p-a1",
      name: "클래식패브릭 폴란드산 직수입 90 호텔 구스이불 겨울 SS",
      imageUrl: "https://placehold.co/200x200/EEE/000?text=P1",
      tag: "넾다세일",
      finalPrice: 299000,
      originalPrice: 559000,
      discountRate: 46,
    },
    {
      id: "p-a2",
      name: "두툼한 먼지없는 사계절 거실바 닥카페트패드",
      imageUrl: "https://placehold.co/200x200/EEE/000?text=P2",
      finalPrice: 23500,
      originalPrice: 32000,
      discountRate: 26,
    },
    {
      id: "p-a3",
      name: "엘린 좌식 포세린 세라믹 소파 거실 테이블 1200",
      imageUrl: "https://placehold.co/200x200/EEE/000?text=P3",
      tag: "넾다세일",
      finalPrice: 279000,
      originalPrice: 399000,
      discountRate: 30,
      shippingFee: 25000,
    },
    {
      id: "p-a4",
      name: "원목 포스터걸이 우드 행잉 프레임 액자 족자...",
      imageUrl: "https://placehold.co/200x200/EEE/000?text=P4",
      finalPrice: 3200,
      originalPrice: 27200,
      discountRate: 88,
      shippingFee: 3000,
    },
    {
      id: "p-a5",
      name: "EVA 냉장고 서랍장 매트 싱크대 선반 시트지...",
      imageUrl: "https://placehold.co/200x200/EEE/000?text=P5",
      finalPrice: 1500,
      shippingFee: 3000,
    },
    {
      id: "p-a6",
      name: "원목 협탁 침대옆 낮은 사이드 테이블 2단",
      imageUrl: "https://placehold.co/200x200/EEE/000?text=P6",
      tag: "넾다세일",
      finalPrice: 118000,
      originalPrice: 190000,
      discountRate: 37,
      shippingFee: 15000,
    },
    {
      id: "p-a7",
      name: "엔젤홈스 접이식 매트리스 바닥 매트 토퍼 침대...",
      imageUrl: "https://placehold.co/200x200/EEE/000?text=P7",
      finalPrice: 40800,
      originalPrice: 156000,
      discountRate: 73,
    },
    {
      id: "p-a8",
      name: "DIY 명화그리기 유화 그림 풍경화 감성 취미...",
      imageUrl: "https://placehold.co/200x200/EEE/000?text=P8",
      finalPrice: 5400,
      originalPrice: 9500,
      discountRate: 43,
    },
    {
      id: "p-a9",
      name: "1+1,매트리스커버,침대커버,매트 커버,슈퍼싱글",
      imageUrl: "https://placehold.co/200x200/EEE/000?text=P9",
      finalPrice: 28800,
      originalPrice: 42000,
      discountRate: 31,
    },
    {
      id: "p-a10",
      name: "본톤 식탁 CDT-388 포세린 세라믹 북미산...",
      imageUrl: "https://placehold.co/200x200/EEE/000?text=P10",
      finalPrice: 1040000,
      originalPrice: 1800000,
      discountRate: 42,
    },
    {
      id: "p-a11",
      name: "루시 린넨 크리스마스 장식 테이블보-화이트...",
      imageUrl: "https://placehold.co/200x200/EEE/000?text=P11",
      finalPrice: 30700,
      originalPrice: 50000,
      discountRate: 38,
      shippingFee: 3000,
    },
    {
      id: "p-a12",
      name: "슬립웍스 힙스 백스 세트 등받이 쿠션 기능성...",
      imageUrl: "https://placehold.co/200x200/EEE/000?text=P12",
      tag: "넾다세일",
      finalPrice: 77000,
      originalPrice: 158000,
      discountRate: 51,
    },
  ],
  2: [
    {
      id: "p-b1",
      name: "Digital Product 1",
      imageUrl: "https://placehold.co/200x200/333/FFF?text=Digital1",
      finalPrice: 120000,
    },
  ],
  9: [
    {
      id: "p-i1",
      name: "Cosmetic 1",
      imageUrl: "https://placehold.co/200x200/FFF/333?text=Beauty1",
      finalPrice: 15000,
    },
  ],
};

const ProductGridSection = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = categories.length;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Fetch: fetchDataForCategory(categories[newPage - 1]);
  };

  const currentProducts = allProductPages[currentPage] || allProductPages[1];

  return (
    <div
      className="w-full py-10"
      style={{ fontFamily: "var(--font-secondary)" }}
    >
      <div className="mb-1.5">
        <h3 className="text-2xl font-bold">
          <span style={{ color: "var(--naver-green)" }}>
            {categories[currentPage - 1]}
          </span>
          <span className="text-white"> 상품 어떠세요?</span>
        </h3>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto py-4">
        {categories.map((category, index) => {
          const pageNum = index + 1;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={category}
              onClick={() => handlePageChange(pageNum)}
              className={`px-3 h-10 rounded-[20px] text-xs font-bold whitespace-nowrap transition-colors ${
                isActive ? "text-white" : "text-gray-400 hover:text-white"
              }`}
              style={{
                background: isActive ? "var(--naver-green)" : "var(--glass-bg)",
                border: isActive ? "none" : "1px solid var(--glass-border)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8 pt-4">
        {currentProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ProductGridSection;
