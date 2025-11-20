import { Link } from "react-router-dom";
import Menu from "../../assets/Menu.svg";
import DarkModeToggle from "../common/DarkModeToggle";

const NaverLogoTop = () => (
  <svg
    width="46"
    height="10"
    viewBox="0 0 46 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="fill-current"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.238 0.5L9.778 9.452H12.719L13.137 8.267H16.454L16.872 9.452H19.814L16.354 0.5H13.238ZM14.796 3.32L15.783 6.116H13.809L14.796 3.32ZM29.245 0.5V9.452H36.211V7.258H32.057V6.05H36.08V3.9H32.057V2.694H36.124V0.5H29.245ZM25.395 0.5L23.318 6.386L21.242 0.5H18.3L21.76 9.452H24.876L28.336 0.5H25.395ZM6.013 0.5V5.291L2.726 0.501H0V9.451H2.856V4.661L6.143 9.451H8.87V0.502H6.013V0.5ZM41.834 4.669H40.32V2.782H41.834C42.348 2.782 42.764 3.204 42.764 3.725C42.7649 3.84805 42.7416 3.97008 42.6954 4.08411C42.6491 4.19815 42.5809 4.30196 42.4945 4.38962C42.4082 4.47728 42.3054 4.54707 42.192 4.595C42.0787 4.64294 41.9571 4.66808 41.834 4.669ZM43.756 6.381L44.024 6.267C45.05 5.832 45.571 4.889 45.571 3.694C45.571 2.563 45.165 1.726 44.363 1.207C43.618 0.725 42.65 0.5 41.32 0.5H37.594V9.452H40.363V6.95H41.358L43.045 9.452H45.986L43.756 6.381Z"
    />
  </svg>
);

const NaverPayIcon = () => (
  <svg
    width="13"
    height="14"
    viewBox="0 0 13 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="fill-current"
  >
    <mask
      id="mask0_17_7514"
      style={{ maskType: "luminance" }}
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="13"
      height="14"
    >
      <path d="M0 0.5H13V13.5H0V0.5Z" fill="white" />
    </mask>
    <g mask="url(#mask0_17_7514)">
      <path d="M13 7C13 8.72391 12.3152 10.3772 11.0962 11.5962C9.87721 12.8152 8.22391 13.5 6.5 13.5C4.77609 13.5 3.12279 12.8152 1.90381 11.5962C0.684819 10.3772 0 8.72391 0 7C0 5.27609 0.684819 3.62279 1.90381 2.40381C3.12279 1.18482 4.77609 0.5 6.5 0.5C8.22391 0.5 9.87721 1.18482 11.0962 2.40381C12.3152 3.62279 13 5.27609 13 7ZM7.587 3.945V7.213L5.312 3.945H3.445V10.063H5.411V6.785L7.686 10.055H9.56V3.945H7.587Z" />
    </g>
  </svg>
);

interface TopBarProps {
  bgColor?: string;
  borderColor?: string;
  textColorClass?: string;
  hoverTextColorClass?: string;
}

const TopBar: React.FC<TopBarProps> = ({
  bgColor = "var(--glass-bg)",
  borderColor = "var(--glass-border)",
  textColorClass = "text-gray-300",
  hoverTextColorClass = "hover:text-white",
}) => {
  return (
    <div
      className="w-full dark:bg-gray-800 transition-colors duration-300"
      style={{
        background: bgColor,
        borderBottom: `1px solid ${borderColor}`,
        fontFamily: "var(--font-secondary)",
      }}
    >
      <div className="container mx-auto max-w-7xl px-4 h-10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className={`flex items-center gap-1.5 ${textColorClass} ${hoverTextColorClass} transition-colors`}
          >
            <NaverLogoTop />
          </Link>
          <Link
            to="/naver-pay"
            className={`flex items-center gap-1 ${textColorClass} ${hoverTextColorClass} transition-colors text-xs`}
          >
            <NaverPayIcon />
            <span>네이버페이</span>
          </Link>
        </div>

        <div className={`flex items-center gap-3 text-sm ${textColorClass}`}>
          <DarkModeToggle />
          <div
            className="border-l h-3"
            style={{ borderColor: borderColor }}
          ></div>
          <Link
            to="/login"
            className={`${hoverTextColorClass} transition-colors`}
          >
            로그인
          </Link>
          <div
            className="border-l h-3"
            style={{ borderColor: borderColor }}
          ></div>
          <Link
            to="/customer-service"
            className={`${hoverTextColorClass} transition-colors`}
          >
            <img src={Menu} alt="" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
