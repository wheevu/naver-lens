import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
    fill="currentColor"
    className="w-3 h-3 ml-0.5"
  >
    <path d="M11.78 1.28a.75.75 0 0 1 0 1.06L5.56 8.562l6.22 6.22a.75.75 0 1 1-1.06 1.06l-6.75-6.75a.75.75 0 0 1 0-1.06l6.75-6.75a.75.75 0 0 1 1.06 0Z" />
    <path d="M12.25 1.75a.75.75 0 0 0-1.5 0v2.546l-6.53-6.53a.75.75 0 0 0-1.06 1.06L9.69 5.25H7.143a.75.75 0 0 0 0 1.5h4.357a.75.75 0 0 0 .75-.75V1.75Z" />
  </svg>
);

const VerticalDivider = () => (
  <div className="h-4 w-px bg-[var(--glass-border)]"></div>
);

const Gnb = () => {
  const { t } = useTranslation();

  return (
    <nav
      className="w-full h-12 shadow-md"
      style={{
        background: "var(--glass-bg)",
        borderTop: "1px solid var(--glass-border)",
        borderBottom: "1px solid var(--glass-border)",
        fontFamily: "var(--font-secondary)",
      }}
    >
      <div
        className="container mx-auto max-w-7xl px-4 h-full flex items-center justify-start gap-4 overflow-x-auto"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>
          {`
            .container::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        {navGroups.map((group, groupIndex) => (
          <React.Fragment key={groupIndex}>
            {groupIndex > 0 && <VerticalDivider />}
            <div className="flex items-center gap-4 whitespace-nowrap">
              {group.map((item) => {
                const commonClasses =
                  "text-base font-bold flex items-center h-12 transition-colors duration-200 hover:text-purple-300 shrink-0";
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
    </nav>
  );
};

export default Gnb;
