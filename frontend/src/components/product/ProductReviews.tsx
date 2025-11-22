import React from "react";
import { useTranslation } from "react-i18next";

interface ProductReviewsProps {
  reviews?: string[];
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ reviews }) => {
  const { t } = useTranslation();
  return (
    <div
      className="mt-12 border-t pt-8"
      style={{ borderColor: "var(--glass-border)" }}
    >
      <h3
        className="text-2xl font-bold mb-6"
        style={{
          color: "var(--text-primary)",
          fontFamily: "var(--font-secondary)",
        }}
      >
        {t("product.reviews")} ({reviews?.length})
      </h3>

      <div className="space-y-6">
        {reviews?.map((review, index) => (
          <div
            key={index}
            className="flex gap-4 p-5 rounded-xl"
            style={{
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
            }}
          >
            <div className="shrink-0">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                }}
              >
                {String.fromCharCode(65 + (index % 26))}{" "}
              </div>
            </div>

            <div className="grow">
              <div className="flex items-center justify-between mb-1">
                <span
                  className="text-sm font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {t("product.anonymous")}
                </span>
                <span
                  className="text-xs opacity-60"
                  style={{ color: "var(--text-secondary)" }}
                >
                  2025.11.{(index % 30) + 1}
                </span>
              </div>

              <div className="flex gap-0.5 mb-2 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-3 h-3"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.868 2.884c.321-.662 1.135-.662 1.456 0l1.86 3.844 4.241.616c.73.107 1.022 1.004.494 1.518l-3.068 2.99 1.23 4.225c.168.722-.53 1.28-1.173.91L10 15.347l-3.77 1.98c-.643.37-1.341-.188-1.173-.91l1.23-4.225-3.068-2.99c-.528-.514-.236-1.411.494-1.518l4.241-.616 1.86-3.844z"
                      clipRule="evenodd"
                    />
                  </svg>
                ))}
              </div>

              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {review}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductReviews;
