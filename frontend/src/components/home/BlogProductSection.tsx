import { useEffect, useState } from "react";
import BlogPanel from "./BlogPanel";
import Pagination from "../common/Pagination";
import axios from "../../api/axios";

/* ------------------------------------------------------------------ */
/* API Types – exactly the shape of your real endpoint               */
/* ------------------------------------------------------------------ */
interface ApiProduct {
  id: string;
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
  options: { name: string; values: string[] }[];
  descriptionPreview: string;
  reviews?: string[];
  category1: string;
  category2: string;
  category3: string;
  category4: string;
}

interface ApiResponse {
  data: ApiProduct[];
  pagination?: any;
}

/* ------------------------------------------------------------------ */
/* Static blogs (feel free to fetch later)                           */
/* ------------------------------------------------------------------ */
type Blog = {
  author: string;
  title: string;
  thumbnailUrl: string;
  bgImageUrl: string;
  link: string;
};

const blogs: Blog[] = [
  {
    author: "유피",
    title: "2025 비비안스타킹 착시 스타킹 작년보다 업그레이드 되...",
    thumbnailUrl: "https://placehold.co/80x80/000000/FFFFFF?text=Blog1",
    bgImageUrl: "https://placehold.co/624x176/333333/FFFFFF?text=Blog+BG+1",
    link: "/blog/yupi",
  },
  {
    author: "안경 an경뷰티",
    title: "메이투(meitu) 겨울코트 느낌 나는 수지 아크네 목도리 패션코디 zip",
    thumbnailUrl: "https://placehold.co/80x80/5588FF/FFFFFF?text=Blog2",
    bgImageUrl: "https://placehold.co/624x176/555555/FFFFFF?text=Blog+BG+2",
    link: "/blog/ankung",
  },
  {
    author: "안경뷰티",
    title: "메이투(meitu) 겨울코트 느낌 나는 수지 아크네 목도리 패션코디 zip",
    thumbnailUrl: "https://placehold.co/80x80/FF5555/FFFFFF?text=Blog3",
    bgImageUrl: "https://placehold.co/624x176/553333/FFFFFF?text=Blog+BG+3",
    link: "/blog/author3",
  },
  {
    author: "안경뷰티",
    title: "메이투(meitu) 겨울코트 느낌 나는 수지 아크네 목도리 패션코디 zip",
    thumbnailUrl: "https://placehold.co/80x80/55FF55/FFFFFF?text=Blog4",
    bgImageUrl: "https://placehold.co/624x176/335533/FFFFFF?text=Blog+BG+4",
    link: "/blog/author4",
  },
];

/* ------------------------------------------------------------------ */
/* ProductListItem props – no onClick any more (Link does it)        */
/* ------------------------------------------------------------------ */
export type ProductListItemProps = {
  id: string;
  name: string;
  imageUrl: string;
  finalPrice: number;
  originalPrice?: number;
  discountRate?: number;
  shippingFee?: number;
};

/* ------------------------------------------------------------------ */
/* Mapper – turn API product → UI props                              */
/* ------------------------------------------------------------------ */
const MAX_DESC_LEN = 80;

const mapProduct = (p: ApiProduct): ProductListItemProps => {
  console.log("Raw product:", p); // ← Add this
  console.log("productId:", p.id); // ← Add this
  const raw = p.descriptionPreview ?? "";
  const name =
    raw.length > MAX_DESC_LEN ? raw.slice(0, MAX_DESC_LEN) + "…" : raw;

  const originalPrice = p.originalPrice > 0 ? p.originalPrice : undefined;
  const discountRate =
    originalPrice && p.price < originalPrice
      ? Math.round(((originalPrice - p.price) / originalPrice) * 100)
      : undefined;

  const shippingFee = p.shipping?.toLowerCase().includes("free")
    ? 0
    : Number(p.shipping?.replace(/[^\d]/g, "")) || undefined;

  return {
    id: p.id,
    name: name || "No description",
    imageUrl: p.images?.[0] ?? "",
    finalPrice: p.price,
    originalPrice,
    discountRate,
    shippingFee,
  };
};

/* ------------------------------------------------------------------ */
/* Main component                                                    */
/* ------------------------------------------------------------------ */
const ITEMS_PER_PAGE = 2;

const BlogProductSection = () => {
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [paired, setPaired] = useState<
    { blog: Blog; products: ProductListItemProps[] }[]
  >([]);

  /* ---- fetch all products once ---- */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get<ApiResponse>("/api/products");
        console.log('cool', data)
        setAllProducts(data.data ?? []);
      } catch (e) {
        console.error(e);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* ---- pair blogs with 3 random products ---- */
  useEffect(() => {
    if (!allProducts.length) {
      setPaired([]);
      return;
    }
    let pool = [...allProducts].sort(() => Math.random() - 0.5);
    const list = blogs.map((b) => {
      const three = pool.slice(0, 3).map(mapProduct);
      pool = pool.slice(3);
      if (pool.length < 3) pool = [...allProducts].sort(() => Math.random() - 0.5);
      return { blog: b, products: three };
    });
    setPaired(list);
  }, [allProducts]);

  /* ---- pagination ---- */
  const totalPages = Math.ceil(paired.length / ITEMS_PER_PAGE);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const current = paired.slice(start, end);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(totalPages);
  }, [totalPages, page]);

  return (
    <div className="w-full py-10">
      <div className="mb-1.5">
        <h3
          className="text-2xl font-bold"
          style={{ fontFamily: "var(--font-secondary)" }}
        >
          <span className="text-white">인기 </span>
          <span style={{ color: "var(--naver-green)" }}>패션</span>
          <span className="text-white"> 블로그와 함께 찾는 상품</span>
        </h3>
      </div>

      <div className="mb-4">
        <p className="text-base text-gray-400">
          최근 7일간 <span className="text-gray-300">패션</span> 분야 클릭 많은 블로그
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-white text-lg">Đang tải...</p>
        </div>
      ) : paired.length === 0 ? (
        <div className="text-center text-gray-400 py-10">
          상품 데이터를 불러올 수 없습니다.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {current.map((item, i) => (
              <BlogPanel
                key={`${page}-${i}`}               // unique per page
                blog={item.blog}
                products={item.products}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BlogProductSection;