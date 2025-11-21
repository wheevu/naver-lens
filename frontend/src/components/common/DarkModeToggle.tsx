import { useTheme } from "../../context/ThemeContext";
import sunFog from "../../assets/sunFog.svg";
import moon from "../../assets/moon.svg";

const DarkModeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center h-6 w-12 rounded-full transition-all duration-300  bg-gray-200 dark:bg-gray-600"
      style={{
        backgroundColor: isDark ? "#4B5563" : "#E5E7EB",
      }}
      aria-label="Toggle Dark Mode"
    >
      <span
        className="inline-block w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ease-in-out"
        style={{
          transform: isDark ? "translateX(24px)" : "translateX(2px)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        }}
      >
        <span className="relative w-full h-full flex items-center justify-center">
          <img
            src={moon}
            alt="Dark mode"
            className="absolute w-3 h-3 transition-opacity duration-300"
            style={{ opacity: isDark ? 1 : 0 }}
          />
          <img
            src={sunFog}
            alt="Light mode"
            className="absolute w-3 h-3 transition-opacity duration-300"
            style={{ opacity: isDark ? 0 : 1 }}
          />
        </span>
      </span>

      <span
        className="absolute right-1.5 transition-opacity duration-300"
        style={{ opacity: isDark ? 0 : 1 }}
      >
        <img src={moon} alt="" className="w-3 h-3 opacity-40" />
      </span>
      <span
        className="absolute left-1.5 transition-opacity duration-300"
        style={{ opacity: isDark ? 1 : 0 }}
      >
        <img src={sunFog} alt="" className="w-3 h-3 opacity-40" />
      </span>
    </button>
  );
};

export default DarkModeToggle;
