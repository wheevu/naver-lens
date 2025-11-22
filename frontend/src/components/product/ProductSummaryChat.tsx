import React, { useState, useEffect, useRef, useMemo } from "react";
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

interface SummaryData {
  overview: string;
  ratings: {
    score: string;
    count: string;
    sentiment: string;
    coverage: string;
  };
  satisfaction: {
    aspects: Array<{
      name: string;
      score: number;
      feedback: string;
    }>;
  };
  keywords: {
    positive: Array<{ word: string; count: number }>;
    concerns: Array<{ word: string; count: number }>;
    notable: Array<{ word: string; count: number }>;
  };
  strengths: string[];
  considerations: string[];
  bestFor: string;
  productInfo: {
    brand: string;
    category: string;
    options: string;
  };
}

// Helper function to parse JSON from summary
const parseSummaryJSON = (summary: string): SummaryData | null => {
  try {
    // Try to parse directly
    const parsed = JSON.parse(summary);
    return parsed;
  } catch (e) {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = summary.match(/```json\s*([\s\S]*?)\s*```/) ||
                     summary.match(/```\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch (e2) {
        console.error("Failed to parse JSON from code block:", e2);
        console.log("Summary snippet:", summary.substring(summary.length - 200));
      }
    }
    
    // Try to find JSON between braces
    const braceMatch = summary.match(/\{[\s\S]*\}/);
    if (braceMatch) {
      try {
        return JSON.parse(braceMatch[0]);
      } catch (e3) {
        console.error("Failed to parse JSON from braces:", e3);
        console.log("Last 200 chars of summary:", summary.substring(summary.length - 200));
      }
    }
    
    console.error("Failed to parse summary JSON:", e);
    console.log("Summary length:", summary.length);
    console.log("Last 300 chars:", summary.substring(summary.length - 300));
    return null;
  }
};

// Chart component
const SatisfactionChart: React.FC<{ 
  aspects: Array<{name: string; score: number; feedback: string}>; 
  theme: string 
}> = ({ aspects, theme }) => {
  return (
    <div className="my-3 space-y-2.5">
      {aspects.map((aspect, index) => (
        <div key={index} className="space-y-1">
          <div className="flex justify-between items-baseline text-xs">
            <span className={`font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
              {aspect.name}
            </span>
            <span className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>
              {aspect.score}%
            </span>
          </div>
          <div className={`w-full h-2 rounded-full overflow-hidden ${
            theme === "dark" ? "bg-gray-700" : "bg-gray-200"
          }`}>
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${aspect.score}%`,
                background: aspect.score >= 70 
                  ? 'linear-gradient(90deg, #10b981, #34d399)'
                  : aspect.score >= 50
                  ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                  : 'linear-gradient(90deg, #ef4444, #f87171)'
              }}
            />
          </div>
          <p className={`text-xs italic ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            {aspect.feedback}
          </p>
        </div>
      ))}
    </div>
  );
};


const ProductSummaryChat: React.FC<ProductSummaryChatProps> = ({ product }) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Parse summary JSON
  const summaryData = useMemo(() => {
    if (!summary) return null;
    return parseSummaryJSON(summary);
  }, [summary]);

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
            maxHeight: "600px",
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
                <h3 className="font-bold text-sm">AI Smart Summary</h3>
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

          <div className="p-4 overflow-y-auto min-h-[200px] max-h-[400px] bg-opacity-50 bg-gray-50 dark:bg-gray-900/50 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">{" "}
            <div className="flex gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-md">
                <AiIcon />
              </div>
              <div className={`p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] text-sm ${
                theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-800"
              }`}>
                <p className="leading-relaxed">
                  Hi! I'm your AI shopping assistant. I'll analyze customer reviews 
                  and provide you with helpful insights about this product.
                </p>
              </div>
            </div>

            {loading && (
              <div className="flex gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-md">
                  <AiIcon />
                </div>
                <div className={`p-4 rounded-2xl rounded-tl-none shadow-sm ${
                  theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                }`}>
                  <div className="flex space-x-1 h-3 items-center">
                    <div className={`w-2 h-2 rounded-full animate-bounce [animation-delay:-0.3s] ${
                      theme === "dark" ? "bg-gray-500" : "bg-gray-400"
                    }`}></div>
                    <div className={`w-2 h-2 rounded-full animate-bounce [animation-delay:-0.15s] ${
                      theme === "dark" ? "bg-gray-500" : "bg-gray-400"
                    }`}></div>
                    <div className={`w-2 h-2 rounded-full animate-bounce ${
                      theme === "dark" ? "bg-gray-500" : "bg-gray-400"
                    }`}></div>
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

            {summary && !loading && summaryData && (
              <div className="flex gap-3 mb-2 animate-in fade-in zoom-in duration-300">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-md">
                  <AiIcon />
                </div>
                <div
                  className={`p-4 rounded-2xl rounded-tl-none shadow-md text-sm leading-relaxed overflow-hidden ${
                    theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
                  }`}
                  style={{
                    border: "1px solid var(--glass-border)",
                    maxWidth: "100%",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  {/* Product Overview */}
                  <section className="mb-4">
                    <h2 className={`text-base font-bold mb-2 ${
                      theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                    }`}>
                      I. Product Overview
                    </h2>
                    <p className={`text-sm leading-relaxed ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}>
                      {summaryData.overview}
                    </p>
                  </section>

                  {/* Customer Ratings */}
                  <section className="mb-4">
                    <h2 className={`text-base font-bold mb-2 ${
                      theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                    }`}>
                      II. Customer Ratings
                    </h2>
                    <ul className="space-y-1 text-sm">
                      <li className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                        <strong className={`font-semibold ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
                          Rating:
                        </strong> ⭐{summaryData.ratings.score} from {summaryData.ratings.count}
                      </li>
                      <li className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                        <strong className={`font-semibold ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
                          Sentiment:
                        </strong> {summaryData.ratings.sentiment}
                      </li>
                      <li className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                        <strong className={`font-semibold ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
                          Coverage:
                        </strong> {summaryData.ratings.coverage}
                      </li>
                    </ul>
                  </section>

                  {/* Satisfaction Chart */}
                  <section className="mb-4">
                    <h2 className={`text-base font-bold mb-2 ${
                      theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                    }`}>
                      III. User's satisfaction
                    </h2>
                    <SatisfactionChart aspects={summaryData.satisfaction.aspects} theme={theme} />
                  </section>

                  {/* Keywords */}
                  <section className="mb-4">
                    <h2 className={`text-base font-bold mb-2 ${
                      theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                    }`}>
                      IV. Keywords
                    </h2>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong className={`font-semibold ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
                          Positive:
                        </strong>
                        <span className={`ml-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                          {summaryData.keywords.positive.map((kw, i) => (
                            <span key={i}>
                              {kw.word} ({kw.count}){i < summaryData.keywords.positive.length - 1 ? " • " : ""}
                            </span>
                          ))}
                        </span>
                      </div>
                      {summaryData.keywords.concerns.length > 0 && (
                        <div>
                          <strong className={`font-semibold ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
                            Concerns:
                          </strong>
                          <span className={`ml-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                            {summaryData.keywords.concerns.map((kw, i) => (
                              <span key={i}>
                                {kw.word} ({kw.count}){i < summaryData.keywords.concerns.length - 1 ? " • " : ""}
                              </span>
                            ))}
                          </span>
                        </div>
                      )}
                      {summaryData.keywords.notable.length > 0 && (
                        <div>
                          <strong className={`font-semibold ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
                            Notable:
                          </strong>
                          <span className={`ml-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                            {summaryData.keywords.notable.map((kw, i) => (
                              <span key={i}>
                                {kw.word} ({kw.count}){i < summaryData.keywords.notable.length - 1 ? " • " : ""}
                              </span>
                            ))}
                          </span>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Strengths */}
                  <section className="mb-4">
                    <h2 className={`text-base font-bold mb-2 ${
                      theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                    }`}>
                      V. Strengths
                    </h2>
                    <ul className="space-y-1.5 ml-4">
                      {summaryData.strengths.map((strength, i) => (
                        <li key={i} className={`text-sm flex items-start gap-2 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}>
                          <span className={`mt-0.5 flex-shrink-0 ${
                            theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                          }`}>•</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* Considerations */}
                  <section className="mb-4">
                    <h2 className={`text-base font-bold mb-2 ${
                      theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                    }`}>
                      VI. Considerations
                    </h2>
                    <ul className="space-y-1.5 ml-4">
                      {summaryData.considerations.map((consideration, i) => (
                        <li key={i} className={`text-sm flex items-start gap-2 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}>
                          <span className={`mt-0.5 flex-shrink-0 ${
                            theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                          }`}>•</span>
                          <span>{consideration}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* Best For */}
                  <section className="mb-4">
                    <h2 className={`text-base font-bold mb-2 ${
                      theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                    }`}>
                      VII. Best For
                    </h2>
                    <p className={`text-sm leading-relaxed ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}>
                      {summaryData.bestFor}
                    </p>
                  </section>

                  {/* Product Info */}
                  <section className="mb-2">
                    <h2 className={`text-base font-bold mb-2 ${
                      theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                    }`}>
                      *Product Info
                    </h2>
                    <ul className="space-y-1 text-sm">
                      <li className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                        <strong className={`font-semibold ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
                          Brand:
                        </strong> {summaryData.productInfo.brand}
                      </li>
                      <li className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                        <strong className={`font-semibold ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
                          Category:
                        </strong> {summaryData.productInfo.category}
                      </li>
                      <li className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                        <strong className={`font-semibold ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
                          Options:
                        </strong> {summaryData.productInfo.options}
                      </li>
                    </ul>
                  </section>

                  {/* Footer */}
                  <div className={`mt-3 pt-3 border-t text-xs flex flex-col justify-between items-center ${
                    theme === "dark" 
                      ? "border-gray-700 text-gray-400" 
                      : "border-gray-200 text-gray-500"
                  }`}>
                    <span className="flex items-center gap-1">
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
                      Generated by AI
                    </span>
                    <span className="text-xs">
                      AI can make mistakes - verify details
                    </span>
                  </div>
                </div>
              </div>
            )}

            {summary && !loading && !summaryData && (
              <div className="flex justify-center mb-4">
                <span className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full border border-red-200 dark:border-red-800">
                  Failed to parse summary. Please try again.
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={`p-3 border-t ${
            theme === "dark" 
              ? "border-gray-700 bg-gray-900" 
              : "border-gray-200 bg-gray-50"
          }`}>
            <div className="relative">
              <input
                type="text"
                placeholder="Ask more about this product..."
                disabled
                className={`w-full pl-4 pr-10 py-2 rounded-full text-sm border focus:outline-none opacity-60 cursor-not-allowed ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-gray-300 placeholder-gray-500"
                    : "bg-white border-gray-200 text-gray-700 placeholder-gray-400"
                }`}
              />
              <button className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 ${
                theme === "dark" ? "text-gray-500" : "text-gray-400"
              }`}>
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
