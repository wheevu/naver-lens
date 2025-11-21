import React from "react";
import { Link } from "react-router-dom";
import { type StoreData } from "./StoreHeader";
import { isLightColor } from "../../utils/color";
import { useTheme } from "../../context/ThemeContext";

const FollowIcon = () => (
  <svg
    width="16"
    height="14"
    viewBox="0 0 16 14"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M14.4 11.06C14.07 10.74 13.62 10.57 13.15 10.57C11.53 10.57 10.22 11.87 10.22 13.46C10.22 13.6 10.23 13.73 10.25 13.86H5.75C5.77 13.73 5.78 13.6 5.78 13.46C5.78 11.87 4.47 10.57 2.85 10.57C2.38 10.57 1.93 10.74 1.6 11.06C0.63 10.09 0 8.78 0 7.33C0 3.76 2.83 0.93 6.4 0.93H9.6C13.17 0.93 16 3.76 16 7.33C16 8.78 15.37 10.09 14.4 11.06Z" />
  </svg>
);

const navItems = [
  { name: "베스트", path: "#" },
  { name: "생활/건강", path: "#" },
  { name: "화장품/미용", path: "#" },
  { name: "디지털/가전", path: "#" },
  { name: "식품", path: "#" },
  { name: "전체상품", path: "#" },
  { name: "묻고 답하기", path: "#" },
  { name: "공지사항", path: "#" },
  { name: "리뷰이벤트", path: "#" },
  { name: "쇼핑스토리", path: "#" },
  { name: "더보기", path: "#", isMore: true },
];

interface StoreNavBarProps {
  store: StoreData;
  loading: boolean;
}

const StoreNavBar: React.FC<StoreNavBarProps> = ({ store, loading }) => {
  const { theme } = useTheme();

  const backgroundColor =
    store.themeColor || (theme === "dark" ? "#1a1a2e" : "#ffffff");

  const isLightBg = isLightColor(backgroundColor);

  const textColor = isLightBg ? "text-gray-900" : "text-white";
  const mutedTextColor = isLightBg ? "text-gray-500" : "text-white/70";
  const hoverTextColor = isLightBg ? "hover:text-black" : "hover:text-gray-200";
  const borderColor = isLightBg ? "border-gray-200" : "border-white/10";

  const btnBg = store.buttonColor || backgroundColor;
  const isBtnLight = isLightColor(btnBg);
  const btnTextColor = isBtnLight ? "text-gray-900" : "text-white";

  return (
    <div
      className="w-full shadow-sm transition-colors duration-500"
      style={{
        backgroundColor: backgroundColor,
        fontFamily: "var(--font-secondary)",
      }}
    >
      <div className="w-full max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <button
          className={`h-9 px-5 flex items-center gap-2 rounded-md transition-opacity hover:opacity-90 ${btnTextColor}`}
          style={{
            backgroundColor: btnBg,
            borderRadius: "var(--radius-md)",
          }}
        >
          <FollowIcon />
          <span className="text-sm font-bold">알림받기</span>
        </button>

        <div className="flex-1 flex justify-center">
          <h1 className={`text-4xl font-bold tracking-tighter ${textColor}`}>
            {store.name}
          </h1>
        </div>

        <div className={`flex items-center gap-4 ${mutedTextColor} text-xs`}>
          <div className="flex items-center gap-1">
            <span>스토어등급</span>
            <span className={`font-bold ${textColor}`}>파워</span>
          </div>
          <div className="flex items-center gap-2">
            <span>오늘 {loading ? "..." : "949"}</span>
            <span>
              전체 {loading ? "..." : store.followers.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <nav className={`w-full border-t border-b ${borderColor}`}>
        <div className="w-full max-w-7xl mx-auto px-4 flex justify-start items-center h-16 overflow-x-auto">
          <div className="flex flex-nowrap gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-bold whitespace-nowrap ${textColor} ${hoverTextColor}`}
              >
                {item.name}
                {item.isMore && " ▾"}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default StoreNavBar;
