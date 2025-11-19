import { useEffect, useState } from 'react';
import sunFog from '../../assets/sunFog.svg';
import moon from '../../assets/moon.svg';

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check localStorage and system preference on mount
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (stored === 'dark' || (!stored && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center h-6 w-12 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-naver-green focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      style={{
        background: isDark 
          ? 'linear-gradient(135deg, #03c75a 0%, #0cf09b 100%)'
          : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        boxShadow: isDark
          ? '0 4px 12px rgba(3, 199, 90, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
          : '0 4px 12px rgba(30, 41, 59, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      }}
      aria-label="Toggle dark mode"
    >
      {/* Toggle Circle */}
      <span
        className="absolute left-0.5 inline-flex items-center justify-center h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300 ease-in-out"
        style={{
          transform: isDark ? 'translateX(24px)' : 'translateX(0)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* Icon inside circle - clean transition */}
        <span className="relative w-3 h-3">
          <img
            src={moon}
            alt="Dark mode"
            className="absolute inset-0 w-3 h-3 transition-opacity duration-300"
            style={{ opacity: isDark ? 0 : 1 }}
          />
          <img
            src={sunFog}
            alt="Light mode"
            className="absolute inset-0 w-3 h-3 transition-opacity duration-300"
            style={{ opacity: isDark ? 1 : 0 }}
          />
        </span>
      </span>

      {/* Background Icons - show opposite of current mode */}
      {/* <span 
        className="absolute left-1.5 transition-opacity duration-300"
        style={{ opacity: isDark ? 0 : 0 }}
      >
        <img src={moon} alt="" className="w-3 h-3" style={{ filter: 'brightness(0) invert(1)' }} />
      </span> */}
      <span 
        className="absolute right-1.5 transition-opacity duration-300"
        style={{ opacity: isDark ? 1 : 0 }}
      >
        <img src={sunFog} alt="" className="w-3 h-3" style={{ filter: 'brightness(0) invert(1)' }} />
      </span>
    </button>
  );
};

export default DarkModeToggle;
