import { useState } from "react";
import BlogPanel from "./BlogPanel";
import Pagination from "../common/Pagination";
import { type ProductListItemProps } from "../common/ProductListItem";
import { useTranslation } from "react-i18next";

const blog1 = {
  author: "유피",
  title: "2025 비비안스타킹 착시 스타킹 작년보다 업그레이드 되...",
  thumbnailUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
  bgImageUrl: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=624&h=176&fit=crop",
  link: "/blog/yupi",
};
const products1: ProductListItemProps[] = [
  {
    id: "p1a",
    name: "착시 기모 스타킹 2p 검스 겨울 스타킹 타이즈...",
    imageUrl: "https://images.unsplash.com/photo-1582966772680-860e372bb558?w=112&h=112&fit=crop",
    finalPrice: 11900,
    originalPrice: 19900,
    discountRate: 38,
    shippingFee: 3000,
  },
  {
    id: "p1b",
    name: "비비안 고탄력 팬티스타킹 5매 10매 여름 스타...",
    imageUrl: "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=112&h=112&fit=crop",
    finalPrice: 8900,
    originalPrice: 9900,
    discountRate: 10,
    shippingFee: 3000,
  },
  {
    id: "p1c",
    name: "비비안 기모 스타킹 유발 무발 스타킹 겨울 검정...",
    imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=112&h=112&fit=crop",
    finalPrice: 7900,
    originalPrice: 9900,
    discountRate: 20,
    shippingFee: 3000,
  },
];
const blog2 = {
  author: "안경뷰티",
  title: "메이투(meitu) 겨울코트 느낌 나는 수지 아크네 목도리 패션코디 zip",
  thumbnailUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop",
  bgImageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=624&h=176&fit=crop",
  link: "/blog/ankung",
};
const products2: ProductListItemProps[] = [
  {
    id: "p2a",
    name: "아크네 머플러 목도리 스키니 네로우 울스카프...",
    imageUrl: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=112&h=112&fit=crop",
    finalPrice: 199000,
    originalPrice: 310000,
    discountRate: 35,
  },
  {
    id: "p2b",
    name: "아크네 목도리 스튜디오 머플러 네로우 스키니...",
    imageUrl: "https://images.unsplash.com/photo-1584736286279-5d85e7c1d234?w=112&h=112&fit=crop",
    finalPrice: 189000,
    originalPrice: 260000,
    discountRate: 27,
    shippingFee: 3000,
  },
  {
    id: "p2c",
    name: "아크네스튜디오 머플러 핑크탭 스키니 네로우 ...",
    imageUrl: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=112&h=112&fit=crop",
    finalPrice: 179000,
    originalPrice: 320000,
    discountRate: 44,
    shippingFee: 4000,
  },
];
const allBlogsData = [
  { blog: blog1, products: products1 },
  { blog: blog2, products: products2 },
  { blog: blog1, products: products1 },
  { blog: blog2, products: products2 },
  { blog: blog1, products: products1 },
  { blog: blog2, products: products2 },
];
const ITEMS_PER_PAGE = 2;

const BlogProductSection = () => {
  const { t } = useTranslation();
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
          <span className="text-(--text-primary)">
            {t("home.fashionBlogTitle")}
          </span>
        </h3>
      </div>
      <div className="mb-4">
        <p className="text-base text-gray-400">
          {t("home.fashionBlogSubtitle")}
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
