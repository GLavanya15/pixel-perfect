import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type SiloTheme = "og" | "light";
const Ctx = createContext<{ theme: SiloTheme; toggle: () => void }>({ theme: "og", toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<SiloTheme>("og");
  useEffect(() => {
    const saved = localStorage.getItem("siloverse-theme");
    if (saved === "light" || saved === "og") setTheme(saved);
  }, []);
  useEffect(() => {
    const el = document.documentElement;
    el.classList.remove("og", "light");
    el.classList.add(theme);
    localStorage.setItem("siloverse-theme", theme);
  }, [theme]);
  return <Ctx.Provider value={{ theme, toggle: () => setTheme((t) => (t === "og" ? "light" : "og")) }}>{children}</Ctx.Provider>;
}
export const useSiloTheme = () => useContext(Ctx);
