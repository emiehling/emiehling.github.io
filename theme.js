// Theme toggle functionality
// Handles light/dark mode switching with localStorage persistence

(function() {
  const THEME_KEY = 'theme-preference';
  
  // Get the user's theme preference
  function getThemePreference() {
    // Check localStorage first
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) {
      return stored;
    }
    // Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  // Apply the theme to the document
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    
    // Update all toggle buttons
    document.querySelectorAll('.theme-toggle').forEach(toggle => {
      toggle.setAttribute('aria-checked', theme === 'dark');
    });
  }
  
  // Toggle between light and dark
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }
  
  // Initialize theme on page load
  function init() {
    // Set initial theme (before DOM is fully loaded to prevent flash)
    setTheme(getThemePreference());
    
    // Wait for DOM to attach event listeners
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', attachListeners);
    } else {
      attachListeners();
    }
  }
  
  // Attach click listeners to toggle buttons
  function attachListeners() {
    document.querySelectorAll('.theme-toggle').forEach(toggle => {
      toggle.addEventListener('click', toggleTheme);
    });
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem(THEME_KEY)) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
  
  // Run initialization
  init();
})();
