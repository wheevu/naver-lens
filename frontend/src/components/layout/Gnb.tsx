import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ChevronLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-4 h-4"
  >
    <path
      fillRule="evenodd"
      d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
      clipRule="evenodd"
    />
  </svg>
);
const ChevronRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-4 h-4"
  >
    <path
      fillRule="evenodd"
      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
      clipRule="evenodd"
    />
  </svg>
);

interface NavItem {
  key: string;
  path: string;
  isActive?: boolean;
  isExternal?: boolean;
}
const navGroup1: NavItem[] = [
  { key: "gnb.sale", path: "/sale" },
  { key: "gnb.home", path: "/", isActive: true },
  { key: "gnb.todayDeal", path: "/today-deal" },
  { key: "gnb.kurlyMart", path: "/kurly-mart" },
  { key: "gnb.best", path: "/best" },
  { key: "gnb.winterFashion", path: "/winter-fashion" },
];
const navGroup2: NavItem[] = [
  { key: "gnb.superReward", path: "/super-reward" },
  { key: "gnb.liveShopping", path: "/live", isExternal: true },
  { key: "gnb.fastDelivery", path: "/fast-delivery" },
  { key: "gnb.giftShop", path: "/gift-shop" },
  { key: "gnb.fashionBeauty", path: "/fashion-beauty" },
];
const navGroup3: NavItem[] = [
  { key: "gnb.nDelivery", path: "/n-delivery" },
  { key: "gnb.foodWindow", path: "/food-window" },
  { key: "gnb.luxury", path: "/luxury" },
  { key: "gnb.mister", path: "/mister" },
  { key: "gnb.specialOffer", path: "/special-offer" },
  { key: "gnb.coupon", path: "/coupons" },
];
const navGroups = [navGroup1, navGroup2, navGroup3];

const ExternalLinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="none"
    className="w-3 h-3 ml-0.5"
  >
    <path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-width="1.25"
      d="M4.734 2H2.761s0 0 0 0A.76.76 0 002 2.76v6.48c0 .42.34.76.76.76h6.464c.42 0 .76-.34.76-.76 0 0 0 0 0 0V7.274"
    ></path>
    <path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.25"
      d="M10 2v3.043M10 2H6.962M10 2L6.456 5.55"
    ></path>
  </svg>
);
const VerticalDivider = () => (
  <div className="h-4 w-px bg(--glass-border)"></div>
);

const Gnb = () => {
  const { t } = useTranslation();
  // 1. Tạo ref để tham chiếu đến thẻ div chứa danh sách cuộn
  const scrollRef = useRef<HTMLDivElement>(null);

  // 2. Hàm xử lý cuộn
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200; // Khoảng cách mỗi lần bấm (px)
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav
      className="w-full h-12 shadow-md group"
      style={{
        background: "var(--glass-bg)",
        borderTop: "1px solid var(--glass-border)",
        borderBottom: "1px solid var(--glass-border)",
        fontFamily: "var(--font-secondary)",
      }}
    >
      <div className="container mx-auto max-w-7xl px-4 h-full relative flex items-center">
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 z-10 p-1.5 rounded-full shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-700 text-(--text-primary)"
          style={{
            background: "var(--glass-bg)",
            backdropFilter: "var(--glass-blur)",
            border: "1px solid var(--glass-border)",
          }}
          aria-label="Scroll left"
        >
          <ChevronLeftIcon />
        </button>

        <div
          ref={scrollRef}
          className="flex items-center justify-start gap-4 overflow-x-auto h-full w-full px-8 hover:cursor-pointer"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style>{`.container::-webkit-scrollbar { display: none; }`}</style>

          {navGroups.map((group, groupIndex) => (
            <React.Fragment key={groupIndex}>
              {groupIndex > 0 && <VerticalDivider />}
              <div className="flex items-center gap-4 whitespace-nowrap shrink-0">
                {group.map((item) => {
                  const commonClasses =
                    "text-base font-bold flex items-center h-12 transition-colors duration-200 hover:text-purple-300";
                  const activeClasses = item.isActive
                    ? "text-purple-400 border-b-2 border-purple-400"
                    : "text-[var(--text-primary)]";

                  const content = (
                    <>
                      {t(item.key)}
                      {item.isExternal && <ExternalLinkIcon />}
                    </>
                  );

                  if (item.isExternal) {
                    return (
                      <a
                        key={item.key}
                        href={item.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${commonClasses} ${activeClasses}`}
                      >
                        {content}
                      </a>
                    );
                  }

                  return (
                    <Link
                      key={item.key}
                      to={item.path}
                      className={`${commonClasses} ${activeClasses}`}
                    >
                      {content}
                    </Link>
                  );
                })}
              </div>
            </React.Fragment>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-2 z-10 p-1.5 rounded-full shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-700 text-(--text-primary) hover:cursor-pointer"
          style={{
            background: "var(--glass-bg)",
            backdropFilter: "var(--glass-blur)",
            border: "1px solid var(--glass-border)",
          }}
          aria-label="Scroll right"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </nav>
  );
};

export default Gnb;
