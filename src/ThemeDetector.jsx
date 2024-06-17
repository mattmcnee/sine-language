import React, { useEffect, useState } from 'react';

const ThemeDetector = () => {
  const [theme, setTheme] = useState('light');

  // Function to get the current theme
  const getCurrentTheme = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    } else {
      return 'light';
    }
  };

  // Function to handle theme changes
  const onThemeChange = (e) => {
    if (e.matches) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  useEffect(() => {
    // Initial theme check
    const initialTheme = getCurrentTheme();
    setTheme(initialTheme);

    // Set up an event listener for changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', onThemeChange);

    // Clean up the event listener on component unmount
    return () => {
      mediaQuery.removeEventListener('change', onThemeChange);
    };
  }, []);

  // Set the background color based on the theme
  const backgroundColor = theme === 'dark' ? '#333' : '#fff';
  const textColor = theme === 'dark' ? '#fff' : '#000';

  return (
    <div style={{ backgroundColor, color: textColor, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h1>The current theme is {theme}</h1>
    </div>
  );
};

export default ThemeDetector;
