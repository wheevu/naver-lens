import React from "react";
import { Link } from "react-router-dom";

interface NavItem {
  name: string;
  path: string;
  isActive?: boolean;
  isExternal?: boolean;
}

const navGroup1: NavItem[] = [
  { name: "넾다세일", path: "/sale" },
  { name: "홈", path: "/", isActive: true },
  { name: "오늘끝딜", path: "/today-deal" },
  { name: "컬리N마트", path: "/kurly-mart" },
  { name: "베스트", path: "/best" },
  { name: "겨울 패션 블프", path: "/winter-fashion" },
];

const navGroup2: NavItem[] = [
  { name: "슈퍼적립", path: "/super-reward" },
  {
    name: "쇼핑 라이브",
    path: "/live",
    isExternal: true,
  },
  { name: "지금배달", path: "/fast-delivery" },
  { name: "선물샵", path: "/gift-shop" },
  { name: "패션뷰티", path: "/fashion-beauty" },
];

const navGroup3: NavItem[] = [
  { name: "N배송", path: "/n-delivery" },
  { name: "푸드윈도", path: "/food-window" },
  { name: "럭셔리", path: "/luxury" },
  { name: "미스터", path: "/mister" },
  { name: "기획전", path: "/special-offer" },
  { name: "쿠폰/혜택", path: "/coupons" },
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
      strokeLinecap="round"
      strokeWidth="1.25"
      d="M4.734 2H2.761s0 0 0 0A.76.76 0 002 2.76v6.48c0 .42.34.76.76.76h6.464c.42 0 .76-.34.76-.76 0 0 0 0 0 0V7.274"
    ></path>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.25"
      d="M10 2v3.043M10 2H6.962M10 2L6.456 5.55"
    ></path>{" "}
  </svg>
);

const VerticalDivider = () => (
  <div className="h-4 w-px" style={{ background: "var(--glass-border)" }}></div>
);

const Gnb = () => {
  return (
    <nav
      className="w-full h-12 shadow-md dark:bg-gray-800 transition-colors duration-300"
      style={{
        background: "var(--glass-bg)",
        borderTop: "1px solid var(--glass-border)",
        borderBottom: "1px solid var(--glass-border)",
        fontFamily: "var(--font-secondary)",
      }}
    >
      <div className="container mx-auto max-w-7xl px-4 h-full flex items-center justify-start gap-4">
        {navGroups.map((group, groupIndex) => (
          <React.Fragment key={groupIndex}>
            {groupIndex > 0 && <VerticalDivider />}

            <div className="flex items-center gap-4">
              {group.map((item) => {
                const commonClasses =
                  "text-base text-(--text-primary) font-bold flex items-center h-12 transition-colors duration-200 hover:text-purple-300 dark:hover:text-naver-green-light";

                const activeClasses = item.isActive
                  ? "text-purple-400 dark:text-naver-green border-b-2 border-purple-400 dark:border-naver-green"
                  : "text-(--text-primary) dark:text-gray-200";

                const content = (
                  <>
                    {item.name}
                    {item.isExternal && <ExternalLinkIcon />}
                  </>
                );

                if (item.isExternal) {
                  return (
                    <a
                      key={item.name}
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
                    key={item.name}
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
