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

export interface ProductListItemProps {
  id: string;
  name: string;
  imageUrl: string;
  finalPrice: number;
  originalPrice?: number;
  discountRate?: number;
  shippingFee?: number;
}

const ProductListItem: React.FC<ProductListItemProps> = ({
  id,
  name,
  imageUrl,
  finalPrice,
  originalPrice,
  discountRate,
  shippingFee,
}) => {
  const { t } = useTranslation();

  return (
    <Link
      to={`/store/${id}`}
      className="w-full flex justify-start items-center gap-3 group"
    >
      <div
        className="w-28 h-28 relative rounded-lg overflow-hidden shrink-0 bg-gray-200 dark:bg-gray-800"
        style={{ borderRadius: "var(--radius-md)" }}
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
        >
          <HeartIcon />
        </button>
      </div>

      <div className="flex flex-col justify-start items-start overflow-hidden">
        <p
          className="text-(--text-primary) text-sm font-normal truncate w-full group-hover:opacity-80 transition-opacity"
          style={{ fontFamily: "var(--font-secondary)" }}
        >
          {name}
        </p>

        {originalPrice && (
          <p className="text-gray-400 text-xs line-through">
            {originalPrice.toLocaleString()}
            {t("common.won")}
          </p>
        )}

        <div className="flex items-center gap-2">
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
          <p className="text-gray-500 text-xs mt-1">
            {t("common.shippingFee")} {shippingFee.toLocaleString()}
            {t("common.won")}
          </p>
        )}
      </div>
    </Link>
  );
};

export default ProductListItem;
