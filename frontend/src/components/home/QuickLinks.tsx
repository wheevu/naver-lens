import { Link } from "react-router-dom";

interface QuickLinkItem {
  name: string;
  path: string;
  imageUrl: string;
  bgColor: string;
}

const quickLinkItems: QuickLinkItem[] = [
  {
    name: "하이엔드",
    path: "/highend",
    imageUrl: "https://placehold.co/64x64/000000/FFFFFF?text=Icon",
    bgColor: "#000000",
  },
  {
    name: "컬리N마트",
    path: "/kurly-mart",
    imageUrl: "https://placehold.co/64x64/5F2484/FFFFFF?text=Icon",
    bgColor: "#5F2484",
  },
  {
    name: "마라톤적립",
    path: "/marathon",
    imageUrl: "https://placehold.co/64x64/24C65A/FFFFFF?text=Icon",
    bgColor: "#24C65A",
  },
  {
    name: "지금배달",
    path: "/delivery",
    imageUrl: "https://placehold.co/64x64/EAFBEF/000000?text=Icon",
    bgColor: "#EAFBEF",
  },
  {
    name: "슈퍼적립",
    path: "/super-reward",
    imageUrl: "https://placehold.co/64x64/E9EFFF/000000?text=Icon",
    bgColor: "#E9EFFF",
  },
  {
    name: "슈퍼특가",
    path: "/super-sale",
    imageUrl: "https://placehold.co/64x64/EDE8FF/000000?text=Icon",
    bgColor: "#EDE8FF",
  },
  {
    name: "N배송",
    path: "/n-delivery",
    imageUrl: "https://placehold.co/64x64/E8F5FF/000000?text=Icon",
    bgColor: "#E8F5FF",
  },
  {
    name: "쇼핑라이브",
    path: "/live-shopping",
    imageUrl: "https://placehold.co/64x64/FFEBE8/000000?text=Icon",
    bgColor: "#FFEBE8",
  },
  {
    name: "선물샵",
    path: "/gift-shop",
    imageUrl: "https://placehold.co/64x64/E9FBF3/000000?text=Icon",
    bgColor: "#E9FBF3",
  },
  {
    name: "쿠폰/혜택",
    path: "/coupon",
    imageUrl: "https://placehold.co/64x64/F8EBFD/000000?text=Icon",
    bgColor: "#F8EBFD",
  },
];

const QuickLinks = () => {
  return (
    <div className="w-full pt-6 pb-10">
      <div className="grid grid-cols-5 md:grid-cols-10 gap-y-4">
        {quickLinkItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="flex flex-col items-center gap-2 group"
          >
            <div
              className="w-16 h-16 rounded-3xl overflow-hidden transition-transform duration-200 group-hover:scale-105"
              style={{
                backgroundColor: item.bgColor,
                borderRadius: "var(--radius-lg)",
              }}
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <span
                className="text-sm text-(--text-primary)"
                style={{ fontFamily: "var(--font-secondary)" }}
              >
                {item.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickLinks;
