import React, { useState, useEffect, useRef } from "react";
import axios from "../../api/axios";
import { useTheme } from "../../context/ThemeContext";
import { type Product } from "../../types/product";

const AiIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7V5.73C8.4 5.39 8 4.74 8 4a2 2 0 0 1 2-2h2M4.5 19h15a.5.5 0 0 0 .5-.5V18a.5.5 0 0 0-.5-.5h-15a.5.5 0 0 0-.5.5v.5a.5.5 0 0 0 .5.5M12 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4m-2 0h4"
      fill="currentColor"
    />
  </svg>
);
const CloseIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
const SendIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

interface ProductSummaryChatProps {
  product: Product;
}

interface SummaryResponse {
  success: boolean;
  data: {
    product: {
      name: string;
      price: string;
      brand: string;
    };
    summary: {
      productId: string;
      summary: string;
      generatedAt: string;
    };
  };
}

const ProductSummaryChat: React.FC<ProductSummaryChatProps> = ({ product }) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchSummary = async () => {
    if (summary) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<SummaryResponse>("/api/summarize", {
        productData: product,
      });

      if (response.data.success) {
        setSummary(response.data.data.summary.summary);
      } else {
        setError("Cannot summarize at the moment");
      }
    } catch (err) {
      console.error(err);
      setError("Fail to connect AI Server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !summary) {
      fetchSummary();
    }
  }, [isOpen, product.productId, summary]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div
          className="mb-4 w-80 sm:w-96 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 origin-bottom-right animate-in fade-in slide-in-from-bottom-4"
          style={{
            backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
            color: theme === "dark" ? "#f3f4f6" : "#1f2937",
            border: "1px solid var(--glass-border)",
            maxHeight: "500px",
          }}
        >
          <div
            className="p-4 flex justify-between items-center border-b"
            style={{
              background: "var(--gradient-button)",
              color: "white",
              borderColor: "var(--glass-border)",
            }}
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-full">
                <AiIcon />
              </div>
              <div>
                <h3 className="font-bold text-sm">NAVER Lens</h3>
                <p className="text-xs opacity-80">Product Highlights</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="p-4 overflow-y-auto min-h-[200px] max-h-[350px] bg-opacity-50 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-md">
                <AiIcon />
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] text-sm">
                <p>
                  Hello. I'm NAVER Lens. I can provide you with wonderful
                  insight of into product.
                </p>
              </div>
            </div>

            {loading && (
              <div className="flex gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-md">
                  <AiIcon />
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none shadow-sm">
                  <div className="flex space-x-1 h-3 items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}

            {error && !loading && (
              <div className="flex justify-center mb-4">
                <span className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full border border-red-200 dark:border-red-800">
                  {error}
                </span>
              </div>
            )}

            {summary && !loading && (
              <div className="flex gap-3 mb-2 animate-in fade-in zoom-in duration-300">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-md">
                  <AiIcon />
                </div>
                <div
                  className="p-3 rounded-2xl rounded-tl-none shadow-md text-sm leading-relaxed"
                  style={{
                    background: theme === "dark" ? "#374151" : "#ffffff",
                    border: "1px solid var(--glass-border)",
                  }}
                >
                  <p className="whitespace-pre-line text-gray-800 dark:text-gray-200">
                    {summary}
                  </p>
                  <div className="mt-2 text-xs text-gray-400 flex justify-end items-center gap-1">
                    <span>Generated by AI</span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask more about this product..."
                disabled
                className="w-full pl-4 pr-10 py-2 rounded-full text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none opacity-60 cursor-not-allowed"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400">
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          group flex items-center justify-center w-14 h-14 rounded-full shadow-lg 
          transform transition-all duration-300 hover:scale-110 active:scale-95
          ${isOpen ? "rotate-90" : "rotate-0"}
        `}
        style={{
          background: "var(--gradient-button)",
          boxShadow: "0 4px 20px rgba(99, 102, 241, 0.4)",
        }}
      >
        {isOpen ? (
          <CloseIcon />
        ) : (
          <div className="relative">
            <AiIcon />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </div>
        )}
        <span className="sr-only">Toggle AI Chat</span>
      </button>
    </div>
  );
};

export default ProductSummaryChat;
