import { useEffect, useState } from "react";
import Pagination from "../common/Pagination";
import ProductCard, { type ProductCardProps } from "../common/ProductCard";
import axios from "../../api/axios";

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

interface ApiProductItem {
  id: string;
  name: string;
  imageUrl: string;
  //   lprice: string;
  //   hprice?: string;
  //   brand: string;
  //   mallName: string;
  //   category1: string;
}

const mapApiToCardProps = (item: ApiProductItem): ProductCardProps => {
  //   const finalPrice = parseInt(item.lprice, 10);
  //   const originalPrice = item.hprice ? parseInt(item.hprice, 10) : 0;
  //   const discountRate =
  //     originalPrice > 0 && finalPrice < originalPrice
  //       ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
  //       : undefined;

  return {
    id: item.id,
    name: item.name.replace(/<b>|<\/b>/g, ""),
    imageUrl: item.imageUrl,
    tag: undefined,
    finalPrice: 0,
    originalPrice: /*originalPrice > 0 ? originalPrice :*/ undefined,
    discountRate: undefined,
  };
};

// const categoryMap: Record<string, string> = {
//   "가구/인테리어": "Home",
//   "디지털/가전": "Electronics",
//   "생활/건강": "Health",
//   "스포츠/레저": "Sports",
//   식품: "Food",
//   "출산/육아": "Kids",
//   패션의류: "Fashion",
//   패션잡화: "Fashion",
//   "화장품/미용": "Beauty",
// };

const ProductGridSection = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [loading, setLoading] = useState(false);
  const totalPages = categories.length;
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/products");
        // const apiCategory = categoryMap[categories[currentPage - 1]];
        // const filteredItems = (response.data as ApiProductItem[]).filter(
        //   (item) => item.category1 === apiCategory
        // // );
        // setProducts(filteredItems.slice(0, 12).map(mapApiToCardProps));

        const allItems = response.data as ApiProductItem[];
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const itemsForThisPage = allItems.slice(startIndex, endIndex);
        setProducts(itemsForThisPage.map(mapApiToCardProps));
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage]);

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

      <div className="relative grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8 pt-4 min-h-[300px]">
        {loading ? (
          <div className="absolute inset-0 flex justify-center items-center">
            <p className="text-white text-lg">Đang tải...</p>
          </div>
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ProductGridSection;
