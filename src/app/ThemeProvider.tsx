"use client";
import { createContext } from "react";

export const ThemeContext = createContext<string>("");
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContext.Provider value="dark">
      {children}
    </ThemeContext.Provider>
  );
}
