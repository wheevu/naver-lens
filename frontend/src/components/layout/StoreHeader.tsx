import React from "react";
import TopBar from "./TopBar";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";

export interface StoreData {
  name: string;
  followers: number;
  avatarUrl: string;
  themeColor?: string;
  buttonColor?: string;
}
interface StoreHeaderProps {
  store: StoreData;
  loading: boolean;
}
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path
      fillRule="evenodd"
      d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
      clipRule="evenodd"
    />
  </svg>
);

const StoreHeader: React.FC<StoreHeaderProps> = ({ store, loading }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const backgroundColor =
    store.themeColor || (theme === "dark" ? "#1a1a2e" : "#ffffff");

  return (
    <header
      className="w-full relative transition-colors duration-500"
      style={{
        backgroundColor: backgroundColor,
        fontFamily: "var(--font-secondary)",
      }}
    >
      <TopBar bgColor={backgroundColor} borderColor="rgba(0, 0, 0, 0.15)" />

      <div className="w-full max-w-7xl mx-auto px-4 h-24 flex justify-between items-center">
        <div className="flex items-center gap-3.5">
          <img
            src={store.avatarUrl}
            alt={store.name}
            className="w-14 h-14 rounded-full bg-black/20"
          />
          <div className="flex flex-col">
            <span
              className="text-lg font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {store.name}
            </span>
            <span
              className="text-sm opacity-80"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("store.followers")}{" "}
              {loading ? "..." : store.followers.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="relative w-72">
          <input
            type="text"
            placeholder={t("store.searchPlaceholder")}
            className="w-full h-10 pl-5 pr-12 rounded-full text-sm bg-white/90 text-black placeholder:text-gray-500"
            style={{ borderRadius: "var(--radius-lg)" }}
          />
          <button
            className="absolute top-0 right-0 h-10 w-12 flex items-center justify-center text-gray-700 hover:text-black"
            aria-label="Search in store"
          >
            <SearchIcon />
          </button>
        </div>
      </div>
    </header>
  );
};

export default StoreHeader;
