import React, { useEffect, useState } from "react";
import { type Product } from "../../types/product";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const RatingStarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-4 h-4 text-yellow-400"
  >
    <path
      fillRule="evenodd"
      d="M10.868 2.884c.321-.662 1.135-.662 1.456 0l1.86 3.844 4.241.616c.73.107 1.022 1.004.494 1.518l-3.068 2.99 1.23 4.225c.168.722-.53 1.28-1.173.91L10 15.347l-3.77 1.98c-.643.37-1.341-.188-1.173-.91l1.23-4.225-3.068-2.99c-.528-.514-.236-1.411.494-1.518l4.241-.616 1.86-3.844z"
      clipRule="evenodd"
    />
  </svg>
);
const ArrowRightIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-3 h-3 ml-1"
  >
    <path
      d="M4.25 9.75L8 6 4.25 2.25"
      stroke="#7A7A7A"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </svg>
);
const NPayIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="15"
    height="15"
    fill="none"
    className="w-4 h-4 mr-1"
  >
    <path
      fill="#00DE5A"
      d="M13.177 0H1.823A1.823 1.823 0 000 1.823v11.354C0 14.184.816 15 1.823 15h11.354A1.823 1.823 0 0015 13.177V1.823A1.823 1.823 0 0013.177 0z"
    ></path>
    <path
      fill="#000"
      d="M11.022 6.656V3.688H9.274V8.6L5.831 3.688H3.978v2.968H1.989v1.687h1.989v2.97h1.748V6.398l3.443 4.913h1.853V8.343h1.99V6.656h-1.99z"
    ></path>
  </svg>
);
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
const CartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-7 h-7"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.3"
      d="M17.75 12.75V8A3.75 3.75 0 0014 4.25v0A3.75 3.75 0 0010.25 8v4.75"
    ></path>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.3"
      d="M22.442 10.25H5.558a.836.836 0 00-.813 1.03l2.113 8.897a3.346 3.346 0 003.255 2.573h7.774a3.346 3.346 0 003.255-2.573l2.113-8.897a.836.836 0 00-.813-1.03z"
    ></path>
  </svg>
);

const ProductBenefits: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div
      className="p-4 rounded-lg my-4"
      style={{
        background: "var(--glass-bg)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--glass-border)",
      }}
    >
      <strong className="text-(--text-primary) font-bold">
        {t("product.benefitInfo")}
      </strong>
      <ul className="text-sm mt-2">
        <li className="flex justify-between text-(--text-secondary)">
          <span>{t("product.maxPoint")}</span>
          <span className="text-(--text-primary) font-bold">
            3,273{t("common.won")}
          </span>
        </li>
        <li className="flex justify-between text-gray-400 text-xs mt-1">
          <span>{t("product.basicAccum")}</span>
          <span>239{t("common.won")}</span>
        </li>
        <li className="flex justify-between text-gray-400 text-xs mt-1">
          <Link to="#" className="flex items-center hover:text-white">
            {t("product.paymentCard")} <ArrowRightIcon />
          </Link>
          <span className="text-green-400">1,676{t("common.won")}</span>
        </li>
        <li className="flex justify-between text-gray-400 text-xs mt-1">
          <Link to="#" className="flex items-center hover:text-white">
            {t("product.paymentMoney")} <ArrowRightIcon />
          </Link>
          <span>478{t("common.won")}</span>
        </li>
        <li
          className="flex justify-between text-gray-400 text-xs mt-2 border-t pt-2"
          style={{ borderColor: "var(--glass-border)" }}
        >
          <span className="flex items-center text-green-400 font-bold">
            <NPayIcon />
            {t("product.membershipPlus")}
          </span>
          <span className="text-green-400">958{t("common.won")}</span>
        </li>
      </ul>
      <button
        className="w-full text-center py-2.5 mt-3 rounded-md text-sm font-bold text-white"
        style={{
          background: "var(--naver-green)",
          borderRadius: "var(--radius-md)",
        }}
      >
        {t("product.startAccum")}
      </button>
    </div>
  );
};

interface SelectedItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}
const SelectedOptionsList: React.FC<{
  items: SelectedItem[];
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, newQty: number) => void;
}> = ({ items, onRemove, onQuantityChange }) => {
  const { t } = useTranslation(); // Hook
  const handleRemove = (id: string) => () => onRemove(id);
  const handleQtyChange = (id: string, newQty: number) => () => {
    if (newQty < 1) onRemove(id);
    else onQuantityChange(id, newQty);
  };

  return (
    <div className="flex flex-col gap-3 mt-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="p-3 rounded-md border"
          style={{
            background: "var(--glass-bg)",
            borderColor: "var(--glass-border)",
          }}
        >
          <div className="flex justify-between items-center">
            <span className="text-(--text-primary) text-sm">{item.name}</span>
            <button
              onClick={handleRemove(item.id)}
              className="text-gray-500 hover:text-(--text-primary) text-lg"
            >
              &times;
            </button>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div
              className="flex items-center border rounded"
              style={{ borderColor: "var(--glass-border)" }}
            >
              <button
                onClick={handleQtyChange(item.id, item.quantity - 1)}
                className="px-2 py-0.5 text-(--text-secondary) hover:text-(--text-primary)"
              >
                -
              </button>
              <span className="px-3 text-sm text-(--text-primary)">
                {item.quantity}
              </span>
              <button
                onClick={handleQtyChange(item.id, item.quantity + 1)}
                className="px-2 py-0.5 text-(--text-secondary) hover:text-(--text-primary)"
              >
                +
              </button>
            </div>
            <span className="text-(--text-primary) font-bold">
              {item.price.toLocaleString()}
              {t("common.won")}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

interface ProductPurchasePanelProps {
  product: Product;
}

const ProductPurchasePanel: React.FC<ProductPurchasePanelProps> = ({
  product,
}) => {
  const { t } = useTranslation();
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [addedItems, setAddedItems] = useState<SelectedItem[]>([]);

  const handleOptionChange = (name: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemoveItem = (id: string) => {
    setAddedItems((prev) => prev.filter((item) => item.id !== id));
  };
  const handleQuantityChange = (id: string, newQty: number) => {
    setAddedItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item
      )
    );
  };

  useEffect(() => {
    const allOptionsSelected = product.options.every(
      (opt) => selectedOptions[opt.name]
    );
    if (allOptionsSelected && product.options.length > 0) {
      const optionNames = product.options.map(
        (opt) => selectedOptions[opt.name]
      );
      const combinedName = `${product.title} - (${optionNames.join(", ")})`;
      const combinedId = `${product.productId}-${optionNames.join("-")}`;
      const existingItem = addedItems.find((item) => item.id === combinedId);

      if (existingItem)
        handleQuantityChange(existingItem.id, existingItem.quantity + 1);
      else
        setAddedItems((prev) => [
          ...prev,
          {
            id: combinedId,
            name: combinedName,
            price: product.price,
            quantity: 1,
          },
        ]);

      setSelectedOptions({});
    }
  }, [selectedOptions, product, addedItems]);

  const totalPrice = addedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountPercent = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <div
      className="w-full md:w-1/2 md:pl-10"
      style={{ fontFamily: "var(--font-secondary)" }}
    >
      <div className="flex items-center gap-1 text-sm text-(--text-muted)">
        <RatingStarIcon />
        <span className="font-bold text-(--text-primary)">
          {product.rating.toFixed(1)}
        </span>
        <span>
          ({product.reviewCount.toLocaleString()} {t("product.reviews")})
        </span>
      </div>

      <h1 className="text-2xl font-bold text-(--text-primary) mt-2">
        {product.title}
      </h1>

      <div className="mt-4">
        {product.originalPrice > 0 && (
          <del className="text-gray-500 text-lg">
            {product.originalPrice.toLocaleString()}
            {t("common.won")}
          </del>
        )}
        <div className="flex items-end gap-2">
          {discountPercent > 0 && (
            <span
              className="text-3xl font-bold"
              style={{ color: "var(--naver-green)" }}
            >
              {discountPercent}%
            </span>
          )}
          <span className="text-3xl font-bold text-(--text-primary)">
            {product.price.toLocaleString()}
            {t("common.won")}
          </span>
        </div>
        <span className="text-sm text-gray-400">{product.shipping}</span>
      </div>

      <ProductBenefits />

      <div
        className="text-sm text-(--text-secondary) border-t border-b py-4"
        style={{ borderColor: "var(--glass-border)" }}
      >
        <span className="w-20 inline-block font-bold">
          {t("product.shipping")}
        </span>
        <span>{product.shipping}</span>
      </div>

      <div className="flex flex-col gap-3 my-4">
        {product.options.map((opt) => (
          <div key={opt.name}>
            <select
              value={selectedOptions[opt.name] || ""}
              onChange={(e) => handleOptionChange(opt.name, e.target.value)}
              className="w-full h-12 px-4 bg-(--glass-bg) text-(--text-primary) rounded-md border focus:outline-none focus:ring-2 focus:ring-naver-green"
              style={{
                borderRadius: "var(--radius-sm)",
                borderColor: "var(--glass-border)",
              }}
            >
              <option value="" disabled className="text-gray-500">
                {opt.name} {t("product.selectOption")}
              </option>
              {opt.values.map((val) => (
                <option key={val} value={val} className="text-black">
                  {val}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <SelectedOptionsList
        items={addedItems}
        onRemove={handleRemoveItem}
        onQuantityChange={handleQuantityChange}
      />

      <div className="flex justify-between items-center mt-6">
        <span className="text-lg text-(--text-primary) font-bold">
          {t("product.total")}
        </span>
        <span className="text-2xl font-bold text-(--text-primary)">
          {totalPrice.toLocaleString()}
          {t("common.won")}
        </span>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          className="flex-1 py-4 text-center text-white font-bold rounded-md transition-opacity hover:opacity-90"
          style={{
            background: "var(--naver-green)",
            borderRadius: "var(--radius-md)",
          }}
        >
          {t("product.buy")}
        </button>
        <button
          className="py-4 px-5 text-(--text-primary) rounded-md hover:bg-black/5 transition-colors"
          style={{
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
            borderRadius: "var(--radius-md)",
          }}
        >
          <HeartIcon />
        </button>
        <button
          className="py-4 px-5 text-(--text-primary) rounded-md hover:bg-black/5 transition-colors"
          style={{
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
            borderRadius: "var(--radius-md)",
          }}
        >
          <CartIcon />
        </button>
      </div>
    </div>
  );
};

export default ProductPurchasePanel;
