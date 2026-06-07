import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { applyTheme, getSavedTheme } from "./utils/theme";

function App() {
  useEffect(() => {
    applyTheme(getSavedTheme());

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = () => {
      const savedTheme = getSavedTheme();

      if (savedTheme === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  return <RouterProvider router={router} />;
}

export default App;