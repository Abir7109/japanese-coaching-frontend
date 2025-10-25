import React, { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const enabled = saved ? saved === 'dark' : prefersDark;
      setIsDark(enabled);
    } catch {}
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {}
    if (next) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-aqua text-ocean hover:bg-aqua/20 transition-colors dark:border-khaki dark:text-sand dark:hover:bg-steel"
      title="Toggle theme"
    >
      {isDark ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M21.64 13.64A9 9 0 1 1 10.36 2.36a7 7 0 1 0 11.28 11.28z" />
          </svg>
          <span className="text-sm font-medium">Dark</span>
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M12 4.5a1 1 0 0 1 1 1V7a1 1 0 1 1-2 0V5.5a1 1 0 0 1 1-1zm0 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM5.636 6.05a1 1 0 0 1 1.414 0l1.06 1.06A1 1 0 0 1 6.697 8.58l-1.06-1.06a1 1 0 0 1 0-1.414zM4.5 12a1 1 0 0 1 1-1H7a1 1 0 1 1 0 2H5.5a1 1 0 0 1-1-1zm11 0a1 1 0 0 1 1-1h1.5a1 1 0 1 1 0 2H16.5a1 1 0 0 1-1-1zM6.697 15.42a1 1 0 0 1 1.414 1.414l-1.06 1.06A1 1 0 1 1 5.636 16.48l1.06-1.06zM12 17a1 1 0 0 1 1 1v1.5a1 1 0 1 1-2 0V18a1 1 0 0 1 1-1zm6.364-10.95a1 1 0 0 1 0 1.414l-1.06 1.06A1 1 0 0 1 15.89 7.11l1.06-1.06a1 1 0 0 1 1.414 0z" />
          </svg>
          <span className="text-sm font-medium">Light</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
