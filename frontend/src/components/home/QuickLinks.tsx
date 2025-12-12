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
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=64&h=64&fit=crop",
    bgColor: "#000000",
  },
  {
    key: "home.quickLinks.kurlyMart",
    path: "/kurly-mart",
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=64&h=64&fit=crop",
    bgColor: "#5F2484",
  },
  {
    key: "home.quickLinks.marathon",
    path: "/marathon",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=64&h=64&fit=crop",
    bgColor: "#24C65A",
  },
  {
    key: "home.quickLinks.delivery",
    path: "/delivery",
    imageUrl: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=64&h=64&fit=crop",
    bgColor: "#EAFBEF",
  },
  {
    key: "home.quickLinks.superReward",
    path: "/super-reward",
    imageUrl: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=64&h=64&fit=crop",
    bgColor: "#E9EFFF",
  },
  {
    key: "home.quickLinks.superSale",
    path: "/super-sale",
    imageUrl: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=64&h=64&fit=crop",
    bgColor: "#EDE8FF",
  },
  {
    key: "home.quickLinks.nDelivery",
    path: "/n-delivery",
    imageUrl: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=64&h=64&fit=crop",
    bgColor: "#E8F5FF",
  },
  {
    key: "home.quickLinks.liveShopping",
    path: "/live-shopping",
    imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=64&h=64&fit=crop",
    bgColor: "#FFEBE8",
  },
  {
    key: "home.quickLinks.giftShop",
    path: "/gift-shop",
    imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=64&h=64&fit=crop",
    bgColor: "#E9FBF3",
  },
  {
    key: "home.quickLinks.coupon",
    path: "/coupon",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=64&h=64&fit=crop",
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
