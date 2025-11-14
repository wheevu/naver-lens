import React from "react";
import { Link } from "react-router-dom";

const HeartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="10"
    fill="none"
    viewBox="0 0 12 10"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5.096 1.408A2.6 2.6 0 0 0 3.263.667a2.6 2.6 0 0 0-1.832.741 2.503 2.503 0 0 0 0 3.598l4.56 4.388L10.7 4.867c.89-.985.842-2.512-.128-3.459A2.6 2.6 0 0 0 8.74.667c-.693 0-1.345.262-1.834.741L4.89 3.353a1.2 1.2 0 0 0-.386.881c0 .332.137.646.386.882a1.38 1.38 0 0 0 1.871 0l1.964-1.887"
    ></path>
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
  return (
    <Link
      to={`/store/${id}`}
      className="w-full flex justify-start items-center gap-3 group"
    >
      <div
        className="w-28 h-28 relative rounded-lg overflow-hidden shrink-0"
        style={{ borderRadius: "var(--radius-md)" }}
      >
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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
      </div>

      <div className="flex flex-col justify-start items-start overflow-hidden">
        {/* Product name */}
        <p
          className="text-white text-sm font-normal truncate w-full group-hover:text-gray-200"
          style={{ fontFamily: "var(--font-secondary)" }}
        >
          {name}
        </p>

        {/* Original price */}
        {originalPrice && (
          <p className="text-gray-500 text-xs line-through">
            {originalPrice.toLocaleString()}원
          </p>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          {discountRate && (
            <span
              className="text-base font-bold"
              style={{ color: "var(--naver-green)" }}
            >
              {discountRate}%
            </span>
          )}
          <span className="text-white text-lg font-bold">
            {finalPrice.toLocaleString()}원
          </span>
        </div>

        {/* Fee (if have) */}
        {shippingFee && (
          <p className="text-gray-400 text-xs mt-1">
            배송비 {shippingFee.toLocaleString()}원
          </p>
        )}
      </div>
    </Link>
  );
};

export default ProductListItem;
