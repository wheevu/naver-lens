import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const HeartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-6.5-6.009C.73 8.633 0 6.962 0 5.304 0 2.383 2.383 0 5.304 0h.003c.636 0 1.253.114 1.85.336A4.806 4.806 0 0110 2.25c.832 0 1.612-.245 2.288-.684A4.804 4.804 0 0114.695 0h.003c2.92 0 5.304 2.383 5.304 5.304 0 1.658-.73 3.329-2.17 4.908a22.045 22.045 0 01-6.5 6.009 20.759 20.759 0 01-1.162.682l-.019.01-.005.003h-.002z" />
  </svg>
);
const ShippingIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4 text-gray-500"
  >
    <path
      d="M12.24 11.6c-.013-.31-.145-.603-.368-.817-.224-.215-.522-.335-.832-.335-.31 0-.61.12-.833.335-.224.214-.356.507-.369.817 0 .318.126.623.351.848.225.225.53.352.85.352.667 0 1.203-.536 1.203-1.2ZM6.16 11.6c0-.318-.126-.623-.351-.848-.225-.225-.53-.352-.85-.352-.663 0-1.197.537-1.2 1.2 0 .318.127.623.352.848.225.225.53.351.848.351.318 0 .623-.127.848-.351.225-.225.351-.53.351-.848Z"
      stroke="currentColor"
      strokeWidth="0.85"
    />
    <path
      d="M7.667 4a.333.333 0 0 0-.334-.333H2.333a.333.333 0 0 0-.333.333v4.333M2 8.333V11.333c0 .184.15.333.333.333H3.667M2 8.333h7.333M9.333 8.327V5.667c0-.184.15-.334.334-.334h2.794c.126 0 .24.072.298.185l1.206 2.412c.023.046.035.097.035.15v2.997c0 .184-.15.333-.333.333H12.333M6.333 11.667h3.334"
      stroke="currentColor"
      strokeWidth="0.85"
      strokeLinecap="square"
    />
  </svg>
);

export interface ProductCardProps {
  id: string;
  name: string;
  imageUrl: string;
  tag?: string;
  finalPrice: number;
  originalPrice?: number;
  discountRate?: number;
  shippingFee?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  imageUrl,
  tag,
  finalPrice,
  originalPrice,
  discountRate,
  shippingFee,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className="w-full flex flex-col group"
      style={{ fontFamily: "var(--font-secondary)" }}
    >
      <Link
        to={`/store/${id}`}
        className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800"
        style={{ borderRadius: "var(--radius-lg)" }}
      >
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <button
          className="absolute bottom-2 right-2 p-1.5 rounded-full transition-colors text-white/70 hover:text-white"
          style={{
            background: "var(--glass-bg)",
            backdropFilter: "var(--glass-blur)",
          }}
          aria-label="Add to wishlist"
        >
          <HeartIcon />
        </button>
        {tag && (
          <span
            className="absolute top-0 left-0 px-2 py-1.5 text-xs font-bold text-white"
            style={{
              background: "var(--naver-dark)",
              borderTopLeftRadius: "var(--radius-lg)",
              borderBottomRightRadius: "var(--radius-lg)",
            }}
          >
            {tag}
          </span>
        )}
      </Link>

      <div className="flex flex-col pt-3 px-1">
        <Link to={`/store/${id}`}>
          <p className="text-(--text-primary) text-sm font-normal h-10 overflow-hidden text-ellipsis group-hover:opacity-80 transition-opacity">
            {name}
          </p>
        </Link>

        {originalPrice && (
          <p className="text-gray-400 text-xs line-through pt-1">
            {originalPrice.toLocaleString()}
            {t("common.won")}
          </p>
        )}

        <div className="flex items-center gap-1.5 pt-1">
          {discountRate && (
            <span
              className="text-base font-bold"
              style={{ color: "var(--naver-green)" }}
            >
              {discountRate}%
            </span>
          )}
          <span className="text-(--text-primary) text-lg font-bold">
            {finalPrice.toLocaleString()}
            {t("common.won")}
          </span>
        </div>

        {shippingFee != null && (
          <div className="flex items-center gap-1 text-xs text-gray-500 pt-1">
            <ShippingIcon />
            <span>
              {shippingFee === 0
                ? t("common.freeShipping")
                : `${shippingFee.toLocaleString()}${t("common.won")}`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
