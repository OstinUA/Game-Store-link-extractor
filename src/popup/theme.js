import { THEME_STORAGE_KEY } from './constants.js';

export function initializeThemeToggle(toggleElement) {
  if (!toggleElement) {
    return;
  }

  const root = document.documentElement;

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    toggleElement.textContent = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
  };

  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

  toggleElement.addEventListener('click', () => {
    const currentTheme = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
  });
}
