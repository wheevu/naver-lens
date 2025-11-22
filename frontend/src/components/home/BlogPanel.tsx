import React from "react";
import { Link } from "react-router-dom";
import ProductListItem, {
  type ProductListItemProps,
} from "../common/ProductListItem";
import { useTranslation } from "react-i18next";

const BlogTagIcon = () => (
  <svg
    width="31"
    height="14"
    viewBox="0 0 31 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M26.707 2.749C27.714 2.749 28.545 3.086 29.042 3.612V2.88H30.882V9.605C30.882 12.549 29.13 14 26.707 14C25.481 14 24.444 13.663 23.802 13.298L24.43 11.744C24.897 12.007 25.743 12.306 26.722 12.306C27.948 12.306 28.926 11.416 28.94 10.273V9.969C28.604 10.364 27.889 10.849 26.78 10.849C24.371 10.849 22.736 9.208 22.736 6.82C22.736 4.432 24.372 2.749 26.707 2.749ZM1.957 3.647C2.381 3.194 3.227 2.739 4.292 2.739C6.642 2.739 8.16 4.365 8.16 6.782C8.16 9.199 6.568 10.84 4.16 10.84C3.153 10.84 2.306 10.415 1.854 9.96V10.707H0V0H1.957V3.647ZM11.543 8.071C11.543 8.903 11.823 9.071 12.273 9.071C12.413 9.071 12.541 9.058 12.55 9.057L12.598 9.051V10.787L12.561 10.793C12.558 10.793 12.271 10.839 11.96 10.839C10.94 10.839 9.586 10.581 9.586 8.354V0H11.543V8.071ZM17.497 2.738C19.964 2.738 21.584 4.467 21.584 6.781C21.584 9.095 19.905 10.839 17.497 10.839C15.089 10.839 13.425 9.125 13.425 6.811C13.425 4.496 15.147 2.738 17.497 2.738ZM26.854 4.482C25.57 4.482 24.694 5.478 24.694 6.797C24.694 8.116 25.583 9.097 26.854 9.097C28.167 9.097 28.999 8.101 28.999 6.797C28.999 5.493 28.137 4.482 26.854 4.482ZM4.043 4.482C2.744 4.482 1.897 5.449 1.897 6.782C1.897 8.115 2.76 9.08 4.057 9.08C5.387 9.08 6.203 8.113 6.203 6.78C6.203 5.447 5.342 4.48 4.043 4.48M17.496 4.51C16.241 4.51 15.38 5.477 15.38 6.794C15.38 8.111 16.255 9.064 17.51 9.064C18.796 9.064 19.628 8.097 19.628 6.794C19.628 5.49 18.751 4.51 17.496 4.51Z"
      fill="white"
    />
  </svg>
);

interface BlogPanelProps {
  blog: {
    author: string;
    title: string;
    thumbnailUrl: string;
    bgImageUrl: string;
    link: string;
  };
  products: ProductListItemProps[];
}

const BlogPanel: React.FC<BlogPanelProps> = ({ blog, products }) => {
  const { t } = useTranslation();
  return (
    <div
      className="w-full flex flex-col rounded-lg overflow-hidden"
      style={{
        background: "var(--glass-bg)",
        border: "1px solid var(--glass-border)",
        borderRadius: "var(--radius-lg)",
      }}
    >
      {/* Blog header */}
      <Link to={blog.link} className="relative w-full h-44 group">
        <img
          src={blog.bgImageUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover backdrop-blur-lg"
        />
        <div
          className="absolute inset-0 bg-linear-to-b from-black/50 to-black/20"
          style={{ backdropFilter: "blur(8px)" }}
        />
        <div className="absolute inset-0 p-6 flex flex-col justify-start">
          <div className="flex items-center">
            <span
              className="px-2.5 py-1.5 rounded-xl flex items-center"
              style={{ backgroundColor: "var(--naver-green)" }}
            >
              <BlogTagIcon />
            </span>
            <span className="ml-2 text-sm text-(--text-primary)/70">
              {t("common.by")} {blog.author}
            </span>
          </div>

          <div className="flex justify-between items-end mt-2 grow">
            <h4
              className="text-xl font-bold text-(--text-primary) w-3/4 [text-shadow:0px_1px_1px_rgb(0_0_0/_0.20)]"
              style={{ fontFamily: "var(--font-secondary)" }}
            >
              {blog.title}
            </h4>
            <img
              src={blog.thumbnailUrl}
              alt={blog.title}
              className="w-20 h-20 rounded-md object-cover border"
              style={{
                borderColor: "var(--glass-border)",
                borderRadius: "var(--radius-sm)",
              }}
            />
          </div>
        </div>
      </Link>

      {/* Products – each has a unique key */}
      <div className="flex flex-col gap-3 p-7">
        {products.map((p) => (
          <ProductListItem key={p.id} {...p} />
        ))}
      </div>
    </div>
  );
};

export default BlogPanel;
