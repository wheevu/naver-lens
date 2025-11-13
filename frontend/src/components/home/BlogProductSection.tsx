import { useState } from "react";
import BlogPanel from "./BlogPanel";
import Pagination from "../common/Pagination";
import type { ProductListItemProps } from "../common/ProductListItem";

// --- Mock Data ---

const blog1 = {
  author: "유피",
  title: "2025 비비안스타킹 착시 스타킹 작년보다 업그레이드 되...",
  thumbnailUrl: "https://placehold.co/80x80/000000/FFFFFF?text=Blog1",
  bgImageUrl: "https://placehold.co/624x176/333333/FFFFFF?text=Blog+BG+1",
  link: "/blog/yupi",
};
const products1: ProductListItemProps[] = [
  {
    id: "p1a",
    name: "착시 기모 스타킹 2p 검스 겨울 스타킹 타이즈...",
    imageUrl: "https://placehold.co/112x112/EEEEEE/000000?text=Stocking1",
    finalPrice: 11900,
    originalPrice: 19900,
    discountRate: 38,
    shippingFee: 3000,
  },
  {
    id: "p1b",
    name: "비비안 고탄력 팬티스타킹 5매 10매 여름 스타...",
    imageUrl: "https://placehold.co/112x112/EEEEEE/000000?text=Stocking2",
    finalPrice: 8900,
    originalPrice: 9900,
    discountRate: 10,
    shippingFee: 3000,
  },
  {
    id: "p1c",
    name: "비비안 기모 스타킹 유발 무발 스타킹 겨울 검정...",
    imageUrl: "https://placehold.co/112x112/EEEEEE/000000?text=Stocking3",
    finalPrice: 7900,
    originalPrice: 9900,
    discountRate: 20,
    shippingFee: 3000,
  },
];

const blog2 = {
  author: "안경뷰티",
  title: "메이투(meitu) 겨울코트 느낌 나는 수지 아크네 목도리 패션코디 zip",
  thumbnailUrl: "https://placehold.co/80x80/5588FF/FFFFFF?text=Blog2",
  bgImageUrl: "https://placehold.co/624x176/555555/FFFFFF?text=Blog+BG+2",
  link: "/blog/ankung",
};
const products2: ProductListItemProps[] = [
  {
    id: "p2a",
    name: "아크네 머플러 목도리 스키니 네로우 울스카프...",
    imageUrl: "https://placehold.co/112x112/EEEEEE/000000?text=Scarf1",
    finalPrice: 199000,
    originalPrice: 310000,
    discountRate: 35,
  },
  {
    id: "p2b",
    name: "아크네 목도리 스튜디오 머플러 네로우 스키니...",
    imageUrl: "https://placehold.co/112x112/EEEEEE/000000?text=Scarf2",
    finalPrice: 189000,
    originalPrice: 260000,
    discountRate: 27,
    shippingFee: 3000,
  },
  {
    id: "p2c",
    name: "아크네스튜디오 머플러 핑크탭 스키니 네로우 ...",
    imageUrl: "https://placehold.co/112x112/EEEEEE/000000?text=Scarf3",
    finalPrice: 179000,
    originalPrice: 320000,
    discountRate: 44,
    shippingFee: 4000,
  },
];
const blog3 = {
  author: "안경뷰티",
  title: "메이투(meitu) 겨울코트 느낌 나는 수지 아크네 목도리 패션코디 zip",
  thumbnailUrl: "https://placehold.co/80x80/FF5555/FFFFFF?text=Blog3",
  bgImageUrl: "https://placehold.co/624x176/553333/FFFFFF?text=Blog+BG+3",
  link: "/blog/author3",
};
const blog4 = {
  author: "안경뷰티",
  title: "메이투(meitu) 겨울코트 느낌 나는 수지 아크네 목도리 패션코디 zip",
  thumbnailUrl: "https://placehold.co/80x80/55FF55/FFFFFF?text=Blog4",
  bgImageUrl: "https://placehold.co/624x176/335533/FFFFFF?text=Blog+BG+4",
  link: "/blog/author4",
};

const allBlogsData = [
  { blog: blog1, products: products1 },
  { blog: blog2, products: products2 },
  { blog: blog3, products: products1 },
  { blog: blog4, products: products2 },
];

const ITEMS_PER_PAGE = 2;

const BlogProductSection = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(allBlogsData.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const currentBlogsToShow = allBlogsData.slice(startIndex, endIndex);

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
          최근 7일간 <span className="text-gray-300">패션</span> 분야 클릭 많은
          블로그
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        {currentBlogsToShow.map((data, index) => (
          <BlogPanel
            key={`${currentPage}-${index}`}
            blog={data.blog}
            products={data.products}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default BlogProductSection;
