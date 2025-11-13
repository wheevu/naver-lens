import React, { useState } from "react";

const PrevIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="23"
    height="33"
    viewBox="0 0 23 33"
    className="opacity-50 hover:opacity-100"
  >
    <g fill="none" fillRule="evenodd">
      <path
        fill="#000"
        d="M15.978 0v1.001h-1V2h-1.001v1h-1v1h-1v1h-1v.999h-1v1h-1v1h-1V9h-1v1h-1v1h-1v1h-1v1h-1v1h-1v.999h-1v1h-1v1h1v1h1V19h1v1h1v1h1v1h1v1h1v.999h1v1h1v1h1v1h1V28h1v1h1v1h1v1h1v1.007h1V33h7v-3h-1v-1h-1v-1h-1v-1.001h-1v-1h-1v-1h-1v-1h-1V23h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1.001h-1v-1h-1v-1h1v-1h1V14h1v-1h1v-1h1v-1h1v-1h1V9h1V7.999h1v-1h1v-1h1V5h1V4h1V3h1V0z"
        opacity="0.1"
      ></path>
      <path
        fill="#FFF"
        d="M16.978 1v1h-1.001v1h-1v1h-1v1h-1v.999h-1v1h-1v1h-1V9h-1v1h-1v1h-1v1h-1v1h-1v1h-1v.999h-1v1h-1v1h1v1h1V19h1v1h1v1h1v1h1v1h1v.999h1v1h1v1h1v1h1V28h1v1h1v1h1v1h1v1h5v-1h-1v-1h-1v-1h-1v-1h-1v-1.001h-1v-1h-1v-1h-1v-1h-1V23h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1.001h-1v-1h-1v-1h1v-1h1V14h1v-1h1v-1h1v-1h1v-1h1V9h1V7.999h1v-1h1v-1h1V5h1V4h1V3h1V2h1V1z"
      ></path>
    </g>
  </svg>
);
const NextIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="23"
    height="33"
    viewBox="0 0 23 33"
    className="opacity-50 hover:opacity-100"
  >
    <g fill="none" fillRule="evenodd">
      <path
        fill="#000"
        d="M7.022 0v1.001h1V2h1.001v1h1v1h1v1h1v.999h1v1h1v1h1V9h1v1h1v1h1v1h1v1h1v1h1v.999h1v1h1v1h-1v1h-1V19h-1v1h-1v1h-1v1h-1v1h-1v.999h-1v1h-1v1h-1v1h-1V28h-1v1h-1v1h-1v1h-1v1.007h-1V33h-7v-3h1v-1h1v-1h1v-1.001h1v-1h1v-1h1v-1h1V23h1v-1h1v-1h1v-1h1v-1h1v-1.001h1v-1h1v-1h-1v-1h-1V14h-1v-1h-1v-1h-1v-1h-1v-1h-1V9h-1V7.999h-1v-1h-1v-1h-1V5h-1V4h-1V3h-1V0z"
        opacity="0.1"
      ></path>
      <path
        fill="#FFF"
        d="M6.022 1v1h1.001v1h1v1h1v1h1v.999h1v1h1v1h1V9h1v1h1v1h1v1h1v1h1v1h1v.999h1v1h1v1h-1v1h-1V19h-1v1h-1v1h-1v1h-1v1h-1v.999h-1v1h-1v1h-1v1h-1V28h-1v1h-1v1h-1v1h-1v1h-5v-1h1v-1h1v-1h1v-1h1v-1.001h1v-1h1v-1h1v-1h1V23h1v-1h1v-1h1v-1h1v-1h1v-1.001h1v-1h1v-1h-1v-1h-1V14h-1v-1h-1v-1h-1v-1h-1v-1h-1V9h-1V7.999h-1v-1h-1v-1h-1V5h-1V4h-1V3h-1V2h-1V1z"
      ></path>
    </g>
  </svg>
);

interface ProductImageGalleryProps {
  images: string[];
  productTitle: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images = [],
  productTitle,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full md:w-1/2 aspect-square bg-gray-800 rounded-lg" />
    );
  }

  return (
    <div
      className="w-full md:w-1/2"
      style={{ fontFamily: "var(--font-secondary)" }}
    >
      <div className="relative aspect-square">
        <img
          src={images[activeIndex]}
          alt={`${productTitle} - ${activeIndex + 1}`}
          className="w-full h-full object-cover rounded-lg"
          style={{ borderRadius: "var(--radius-lg)" }}
        />
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 text-white/50 hover:text-white z-10"
          aria-label="Previous Image"
        >
          <PrevIcon />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-white/50 hover:text-white z-10"
          aria-label="Next Image"
        >
          <NextIcon />
        </button>
      </div>

      <ul className="flex gap-2 mt-2 p-1 overflow-x-auto">
        {images.map((img, index) => (
          <li key={index} className="shrink-0">
            <button
              onClick={() => setActiveIndex(index)}
              className={`w-14 h-14 rounded-md overflow-hidden transition-all ${
                index === activeIndex
                  ? "border-2 border-white"
                  : "border-2 border-transparent opacity-60 hover:opacity-100"
              }`}
              style={{ borderRadius: "var(--radius-sm)" }}
            >
              <img
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductImageGallery;
