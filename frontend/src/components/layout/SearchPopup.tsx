import React from "react";

interface MockProduct {
  id: number;
  name: string;
  price: string;
  imageUrl: string;
  discount?: string;
}

const mockProducts: MockProduct[] = [
  {
    id: 1,
    name: "경량 후드 패딩 점퍼 (블랙 그레이 아이보...",
    price: "72,930원",
    imageUrl: "https://via.placeholder.com/150/111/EEE?text=Product1", // Placeholder
  },
  {
    id: 2,
    name: "루이비통 올인 BB M1 3480",
    price: "3,871,390원",
    imageUrl: "https://via.placeholder.com/150/222/EEE?text=Product2", // Placeholder
  },
  {
    id: 3,
    name: "담드솜 오버핏 숏패딩... 이 누빔 경량 퀼팅 패...",
    price: "49,900원",
    discount: "50%",
    imageUrl: "https://via.placeholder.com/150/333/EEE?text=Product3", // Placeholder
  },
  {
    id: 4,
    name: "파타고니아... 바람막...",
    price: "169,000원",
    imageUrl: "https://via.placeholder.com/150/444/EEE?text=Product4", // Placeholder
  },
];

const mockKeywords = [
  "케이스티파이",
  "자라",
  "빼빼로",
  "아이폰17",
  "루이비통",
  "룰루레몬",
  "파타고니아",
  "경량패딩",
];

interface SearchPopupProps {
  onClose: () => void;
}

const SearchPopup: React.FC<SearchPopupProps> = ({ onClose }) => {
  return (
    <div
      className="app-panel absolute top-full mt-2 w-[500px] z-50 p-6"
      style={{
        fontFamily: "var(--font-secondary)",
      }}
    >
      {" "}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-400 mb-3">
          최근 검색어
        </h3>
        <p className="text-gray-500 text-center py-4">
          최근 검색어 내역이 없습니다.
        </p>
      </div>
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-400 mb-4">
          추천 검색어 기반 상품
        </h3>
        <div className="flex overflow-x-auto gap-3 pb-2">
          {mockProducts.map((product) => (
            <div key={product.id} className="w-28 shrink-0">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-28 h-28 object-cover rounded-lg border"
                style={{ borderColor: "var(--glass-border)" }} //
              />
              <p className="text-white text-xs mt-2 truncate">{product.name}</p>
              <div className="flex items-center gap-1">
                {product.discount && (
                  <span className="text-red-500 font-bold text-sm">
                    {product.discount}
                  </span>
                )}
                <span className="text-white font-bold text-sm">
                  {product.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-400 mb-4">
          추천 검색어
        </h3>
        <div className="flex flex-wrap gap-2">
          {mockKeywords.map((keyword) => (
            <button key={keyword} className="key-badge">
              {keyword}
            </button>
          ))}
        </div>
      </div>
      <div
        className="flex justify-between items-center pt-4 border-t"
        style={{ borderColor: "var(--glass-border)" }}
      >
        <span className="text-gray-400 text-xs">자동저장 끄기</span>
        <button
          className="text-gray-400 text-xs font-bold hover:text-white"
          onClick={onClose}
        >
          닫기 (Close)
        </button>
      </div>
    </div>
  );
};

export default SearchPopup;
