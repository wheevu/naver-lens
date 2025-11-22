import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface QuickLinkItem {
  key: string;
  path: string;
  imageUrl: string;
  bgColor: string;
}

const quickLinkItems: QuickLinkItem[] = [
  {
    key: "home.quickLinks.highend",
    path: "/highend",
    imageUrl: "https://placehold.co/64x64/000000/FFFFFF?text=Icon",
    bgColor: "#000000",
  },
  {
    key: "home.quickLinks.kurlyMart",
    path: "/kurly-mart",
    imageUrl: "https://placehold.co/64x64/5F2484/FFFFFF?text=Icon",
    bgColor: "#5F2484",
  },
  {
    key: "home.quickLinks.marathon",
    path: "/marathon",
    imageUrl: "https://placehold.co/64x64/24C65A/FFFFFF?text=Icon",
    bgColor: "#24C65A",
  },
  {
    key: "home.quickLinks.delivery",
    path: "/delivery",
    imageUrl: "https://placehold.co/64x64/EAFBEF/000000?text=Icon",
    bgColor: "#EAFBEF",
  },
  {
    key: "home.quickLinks.superReward",
    path: "/super-reward",
    imageUrl: "https://placehold.co/64x64/E9EFFF/000000?text=Icon",
    bgColor: "#E9EFFF",
  },
  {
    key: "home.quickLinks.superSale",
    path: "/super-sale",
    imageUrl: "https://placehold.co/64x64/EDE8FF/000000?text=Icon",
    bgColor: "#EDE8FF",
  },
  {
    key: "home.quickLinks.nDelivery",
    path: "/n-delivery",
    imageUrl: "https://placehold.co/64x64/E8F5FF/000000?text=Icon",
    bgColor: "#E8F5FF",
  },
  {
    key: "home.quickLinks.liveShopping",
    path: "/live-shopping",
    imageUrl: "https://placehold.co/64x64/FFEBE8/000000?text=Icon",
    bgColor: "#FFEBE8",
  },
  {
    key: "home.quickLinks.giftShop",
    path: "/gift-shop",
    imageUrl: "https://placehold.co/64x64/E9FBF3/000000?text=Icon",
    bgColor: "#E9FBF3",
  },
  {
    key: "home.quickLinks.coupon",
    path: "/coupon",
    imageUrl: "https://placehold.co/64x64/F8EBFD/000000?text=Icon",
    bgColor: "#F8EBFD",
  },
];

const QuickLinks = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full pt-6 pb-10">
      <div className="grid grid-cols-5 md:grid-cols-10 gap-y-4">
        {quickLinkItems.map((item) => (
          <Link
            key={item.key}
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
                alt={t(item.key)}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <span
                className="text-sm text-(--text-secondary)"
                style={{ fontFamily: "var(--font-secondary)" }}
              >
                {t(item.key)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickLinks;
