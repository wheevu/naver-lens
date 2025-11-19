import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import SearchPopup from "./SearchPopup";
import Logo from "../../assets/NaverShopLogo.png";

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
  >
    <path
      fillRule="evenodd"
      d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
      clipRule="evenodd"
    />
  </svg>
);

const CategoryIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-7 h-7"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12.365 8.522a3.86 3.86 0 11-7.72 0 3.86 3.86 0 017.72 0zm3.343-1.691c0-1.146.929-2.075 2.075-2.075h3.382c1.146 0 2.075.929 2.075 2.075v3.382a2.075 2.075 0 01-2.075 2.075h-3.382a2.075 2.075 0 01-2.075-2.075V6.83zM4.756 17.827c0-1.146.929-2.074 2.074-2.074h3.383c1.145 0 2.074.928 2.074 2.074v3.382a2.075 2.075 0 01-2.074 2.075H6.83a2.075 2.075 0 01-2.074-2.075v-3.382zm13.314-1.213a1.59 1.59 0 012.753 0l2.173 3.763a1.59 1.59 0 01-1.377 2.385h-4.345a1.59 1.59 0 01-1.377-2.385l2.173-3.763z"
    />
  </svg>
);

const MyShoppingIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-7 h-7"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.915 13.144a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5zm-7.88 9.391a1.379 1.379 0 01-1.379-1.378v0c0-.763.36-1.482.968-1.94a13.354 13.354 0 0116.066 0c.608.459.966 1.176.966 1.938v0a1.38 1.38 0 01-1.38 1.38H6.035z"
    />
  </svg>
);

const CartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-7 h-7"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.3"
      d="M17.75 12.75V8A3.75 3.75 0 0014 4.25v0A3.75 3.75 0 0010.25 8v4.75"
    ></path>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.3"
      d="M22.442 10.25H5.558a.836.836 0 00-.813 1.03l2.113 8.897a3.346 3.346 0 003.255 2.573h7.774a3.346 3.346 0 003.255-2.573l2.113-8.897a.836.836 0 00-.813-1.03z"
    ></path>
  </svg>
);

const MainHeader = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Logic để đóng popup khi nhấn ra bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="w-full dark:bg-gray-800 transition-colors duration-300"
      style={{
        background: "var(--glass-bg)",
        borderBottom: "1px solid var(--glass-border)",
        fontFamily: "var(--font-secondary)",
      }}
    >
      <div className="container mx-auto max-w-7xl px-4 h-16 flex items-center justify-between gap-6 relative">
        <div className="shrink-0 w-50 h-auto">
          <img src={Logo} alt="" />
        </div>

        <div className="relative grow max-w-xl" ref={searchRef}>
          <div className="relative">
            <input
              type="text"
              placeholder="상품명 또는 브랜드 입력"
              className="w-full h-12 pl-5 pr-14 rounded-lg text-lg text-white border-2 border-purple-500 dark:border-naver-green focus:border-purple-400 dark:focus:border-naver-green-light focus:ring-2 focus:ring-purple-400 dark:focus:ring-naver-green focus:outline-none transition-colors duration-300"
              style={{
                background: "rgba(0, 0, 0, 0.2)",
                fontFamily: "var(--font-secondary)",
              }}
              onFocus={() => setIsSearchOpen(true)}
            />
            <button
              className="absolute right-0 top-0 h-12 w-14 flex items-center justify-center text-purple-400 dark:text-naver-green hover:text-purple-300 dark:hover:text-naver-green-light transition-colors duration-300"
              style={{
                borderTopRightRadius: "8px",
                borderBottomRightRadius: "8px",
              }}
            >
              <SearchIcon />
            </button>
          </div>

          {isSearchOpen && (
            <SearchPopup onClose={() => setIsSearchOpen(false)} />
          )}
        </div>

        <div className="flex items-center gap-5 text-white dark:text-gray-200 transition-colors duration-300">
          <Link
            to="/categories"
            className="flex flex-col items-center gap-1 hover:text-purple-300 dark:hover:text-naver-green-light transition-colors duration-200"
          >
            <CategoryIcon />
            <span className="text-xs font-light">카테고리</span>
          </Link>
          <Link
            to="/my"
            className="flex flex-col items-center gap-1 hover:text-purple-300 dark:hover:text-naver-green-light transition-colors duration-200"
          >
            <MyShoppingIcon />
            <span className="text-xs font-light">마이쇼핑</span>
          </Link>
          <Link
            to="/cart"
            className="flex flex-col items-center gap-1 hover:text-purple-300 dark:hover:text-naver-green-light transition-colors duration-200"
          >
            <CartIcon />
            <span className="text-xs font-light">장바구니</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainHeader;
