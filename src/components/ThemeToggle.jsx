import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) return storedTheme === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  const [darkMode, setDarkMode] = useState(getInitialTheme());

  useEffect(() => {
    const applyTheme = (isDark) => {
      if (isDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    };

    applyTheme(darkMode);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (e) => {
      if (!localStorage.getItem("theme")) {
        setDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [darkMode]);

  return (
    <button
      className="fixed bottom-10 right-10 p-3 rounded-full bg-gray-700 text-white dark:bg-yellow-600 dark:text-black shadow-lg "
      onClick={() => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem("theme", newMode ? "dark" : "light");
      }}
    >
      {darkMode ? "☀️" : "🌙"}
    </button>
  );
};

export default ThemeToggle;
