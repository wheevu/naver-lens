import React from "react";
import { Link } from "react-router-dom";
import { type StoreData } from "./StoreHeader";
import FollowIcon from "../../assets/IconBellPlusWhite.svg";

const PowerIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-3.5 h-3.5"
  >
    <path
      d="M2.934 13.066C1.701 11.833 1 10.185 1 8.42V2.414L7 1L13 2.414V8.42C13 10.185 12.299 11.833 11.066 13.066L7 11.652L2.934 13.066Z"
      fill="#00C73C"
    />
  </svg>
);
const InfoIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="black"
    xmlns="http://www.w3.org/2000/svg"
    className="w-3.5 h-3.5 opacity-30"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 13.5C10.5899 13.5 13.5 10.5899 13.5 7C13.5 3.41015 10.5899 0.5 7 0.5C3.41015 0.5 0.5 3.41015 0.5 7C0.5 10.5899 3.41015 13.5 7 13.5ZM7.875 3.5V4.75H6.125V3.5H7.875ZM7.875 6.125V10.5H6.125V6.125H7.875Z"
    />
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
  const isDarkBg = store.themeColor !== "#FFFFFF";
  const buttonTextColor = isDarkBg ? "text-gray-900" : "text-white";
  const buttonBgColor = store.buttonColor || store.themeColor;

  const textColor = isDarkBg ? "text-white" : "text-gray-800";
  const mutedTextColor = isDarkBg ? "text-white/70" : "text-gray-600";
  const logoColor = isDarkBg ? "text-white" : "text-black";

  return (
    <div
      className="w-full bg-white shadow-sm"
      style={{ fontFamily: "var(--font-secondary)" }}
    >
      <div className="w-full max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <button
          className={`h-9 px-5 flex items-center gap-2 rounded-md transition-opacity hover:opacity-90 ${buttonTextColor}`}
          style={{
            backgroundColor: buttonBgColor,
            borderRadius: "var(--radius-md)",
          }}
        >
          <img src={FollowIcon} alt="" />
          <span className="text-sm font-bold">알림받기</span>
        </button>

        <div className="flex-1 flex justify-center">
          <h1 className={`text-4xl font-bold tracking-tighter ${logoColor}`}>
            {store.name}
          </h1>
        </div>

        <div className={`block items-center gap-5 ${mutedTextColor} text-xs`}>
          <div className="flex items-center gap-1">
            <span>스토어등급</span>
            <PowerIcon />
            <span className={`font-bold ${textColor}`}>파워</span>
            <InfoIcon />
          </div>
          <div className="flex items-center gap-2">
            <span>오늘 {loading ? "..." : "949"}</span>
            <span>
              전체 {loading ? "..." : store.followers.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <nav className="w-full border-t border-b border-gray-200">
        <div className="w-full max-w-7xl mx-auto px-4 flex justify-center items-center h-16 overflow-x-auto">
          <div className="flex flex-nowrap gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-bold whitespace-nowrap ${
                  item.isMore
                    ? "text-gray-500 hover:text-black"
                    : "text-black hover:text-green-600"
                }`}
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
