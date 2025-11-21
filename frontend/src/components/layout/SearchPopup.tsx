// src/components/SearchPopup.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios";

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
  "나이키",
  "아디다스",
  "패딩",
  "아이폰",
  "에어팟",
  "갤럭시",
  "자라",
  "루이비통",
];

const SearchPopup: React.FC<SearchPopupProps> = ({ query, onClose }) => {
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
            p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 8);

      setResults(filtered);
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => searchProducts(query), 300);
    return () => clearTimeout(timer);
  }, [query, searchProducts]);

  return (
    <div
      className="absolute top-full mt-2 w-full max-w-2xl left-1/2 -translate-x-1/2 z-50 rounded-xl shadow-2xl overflow-hidden"
      style={{
        background: "var(--glass-bg)",
        border: "1px solid var(--glass-border)",
        backdropFilter: "blur(12px)",
        fontFamily: "var(--font-secondary)",
      }}
    >
      <div className="p-5 max-h-96 overflow-y-auto">
        {/* Kết quả tìm kiếm */}
        {query && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">
              검색 결과
            </h3>

            {loading ? (
              <div className="text-center py-8 text-gray-300">검색 중...</div>
            ) : results.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                "{query}"에 맞는 상품이 없습니다.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {results.map((product) => {
                  const discount =
                    product.originalPrice > product.price
                      ? Math.round(
                          ((product.originalPrice - product.price) /
                            product.originalPrice) *
                            100
                        )
                      : 0;

                  return (
                    <Link
                      key={product.id}
                      to={`/store/${product.id}`}
                      onClick={onClose}
                      className="block group"
                    >
                      <div className="bg-gray-800/60 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300">
                        <img
                          src={
                            product.imageUrl ||
                            "https://via.placeholder.com/300x300/1a1a1a/888?text=No+Image"
                          }
                          alt={product.name}
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/300x300/1a1a1a/888?text=No+Image";
                          }}
                        />
                        <div className="p-3">
                          <p className="text-(--text-primary) text-xs line-clamp-2 font-medium leading-tight">
                            {product.name}
                          </p>
                          {product.brand && (
                            <p className="text-gray-400 text-xs mt-1">
                              {product.brand}
                            </p>
                          )}
                          <div className="mt-2 flex items-center gap-1.5">
                            {discount > 0 && (
                              <span className="text-green-400 font-bold text-sm">
                                {discount}%
                              </span>
                            )}
                            <span className="text-(--text-primary) font-bold text-sm">
                              {product.price.toLocaleString()}원
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 추천 검색어 */}
        <div className="pt-4 border-t border-gray-700">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">
            추천 검색어
          </h3>
          <div className="flex flex-wrap gap-2">
            {mockKeywords.map((kw) => (
              <button
                key={kw}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-purple-600 hover:text-(--text-primary)"
                style={{
                  background: "rgba(147, 51, 234, 0.15)",
                  color: "#c4b5fd",
                  border: "1px solid rgba(147, 51, 234, 0.3)",
                }}
                onClick={onClose}
              >
                {kw}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-700">
          <span className="text-xs text-gray-500">자동저장 끄기</span>
          <button
            onClick={onClose}
            className="text-xs font-medium text-gray-400 hover:text-(--text-primary) transition"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchPopup;
