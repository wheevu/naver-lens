import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios";
import { useTranslation } from "react-i18next";

interface Product {
  id: string;
  name: string;
  imageUrl?: string;
  price: number;
  originalPrice: number;
  brand?: string;
  mallName?: string;
}

interface SearchPopupProps {
  query: string;
  onClose: () => void;
}

const mockKeywords = [
  "Nike",
  "Adidas",
  "Padding",
  "iPhone",
  "AirPods",
  "Galaxy",
  "Zara",
  "Louis Vuitton",
];

const SearchPopup: React.FC<SearchPopupProps> = ({ query, onClose }) => {
  const { t } = useTranslation();
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const searchProducts = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get<{ data: Product[] }>("/api/products");
      const products = res.data.data || [];

      const filtered = products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.brand &&
              p.brand.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .slice(0, 5);

      setResults(filtered);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) searchProducts(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, searchProducts]);

  return (
    <div
      className="absolute top-full left-0 mt-2 w-full rounded-xl shadow-2xl backdrop-blur-xl border p-6 z-50 transition-colors duration-300"
      style={{
        background: "var(--glass-bg)",
        borderColor: "var(--glass-border)",
        fontFamily: "var(--font-secondary)",
      }}
    >
      {query && (
        <div className="mb-6">
          <h3
            className="text-sm font-semibold mb-3"
            style={{ color: "var(--text-muted)" }}
          >
            {loading ? "Searching..." : t("searchPopup.recommendedProducts")}{" "}
          </h3>

          {results.length === 0 && !loading ? (
            <p
              className="text-sm py-4 text-center"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("searchPopup.noResults")} "{query}"
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {results.map((product) => (
                <Link
                  key={product.id}
                  to={`/store/${product.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="w-12 h-12 rounded-md overflow-hidden shrink-0 bg-gray-200">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span
                      className="text-sm font-medium truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {product.name}
                    </span>
                    <div className="flex items-center gap-2 text-xs">
                      <span style={{ color: "var(--text-secondary)" }}>
                        {product.brand}
                      </span>
                      <span
                        className="font-bold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {product.price.toLocaleString()}원
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      <div
        className="pt-4 border-t"
        style={{ borderColor: "var(--glass-border)" }}
      >
        <h3
          className="text-sm font-semibold mb-3"
          style={{ color: "var(--text-muted)" }}
        >
          {t("searchPopup.recommendedKeywords")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {mockKeywords.map((kw) => (
            <button
              key={kw}
              className="px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:opacity-80"
              style={{
                background: "var(--gradient-primary)",
                color: "var(--text-primary)",
                border: "1px solid var(--glass-border)",
                opacity: 0.9,
              }}
              onClick={() => {
                onClose();
              }}
            >
              {kw}
            </button>
          ))}
        </div>
      </div>

      <div
        className="flex justify-between items-center pt-4 mt-4 border-t"
        style={{ borderColor: "var(--glass-border)" }}
      >
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {t("searchPopup.autoSaveOff")}
        </span>
        <button
          onClick={onClose}
          className="text-xs font-medium hover:underline"
          style={{ color: "var(--text-secondary)" }}
        >
          {t("common.close")}
        </button>
      </div>
    </div>
  );
};

export default SearchPopup;
