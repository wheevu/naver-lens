import React from "react";

const ChevronLeftIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" className="w-5 h-5 rotate-180">
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M5.667 13l5-5-5-5"
    ></path>
  </svg>
);
const ChevronRightIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" className="w-5 h-5">
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M5.667 13l5-5-5-5"
    ></path>
  </svg>
);

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePrev = () => {
    const newPage = currentPage === 1 ? totalPages : currentPage - 1;
    onPageChange(newPage);
  };

  const handleNext = () => {
    const newPage = currentPage === totalPages ? 1 : currentPage + 1;
    onPageChange(newPage);
  };

  return (
    <div className="w-full flex justify-center items-center gap-4 py-6">
      <button
        onClick={handlePrev}
        className="w-16 h-10 flex justify-center items-center rounded-lg transition-colors text-white/70 hover:text-white disabled:opacity-30"
        style={{
          background: "var(--glass-bg)",
          border: "1px solid var(--glass-border)",
          borderRadius: "var(--radius-md)",
        }}
        aria-label="Previous page"
      >
        <ChevronLeftIcon />
      </button>

      <div
        className="text-base font-bold text-white"
        style={{ fontFamily: "var(--font-secondary)" }}
      >
        {currentPage}
        <span className="text-gray-500 font-medium"> / {totalPages}</span>
      </div>

      <button
        onClick={handleNext}
        className="w-16 h-10 flex justify-center items-center rounded-lg transition-colors text-white/70 hover:text-white disabled:opacity-30"
        style={{
          background: "var(--glass-bg)",
          border: "1px solid var(--glass-border)",
          borderRadius: "var(--radius-md)",
        }}
        aria-label="Next page"
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
};

export default Pagination;
