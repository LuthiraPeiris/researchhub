export const applyTheme = (theme) => {
  const root = document.documentElement;

  root.classList.remove("light", "dark");

  if (theme === "dark") {
    root.classList.add("dark");
  } else if (theme === "light") {
    root.classList.add("light");
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (prefersDark) {
      root.classList.add("dark");
    } else {
      root.classList.add("light");
    }
  }

  localStorage.setItem("theme", theme);
};

export const getSavedTheme = () => {
  return localStorage.getItem("theme") || "system";
};