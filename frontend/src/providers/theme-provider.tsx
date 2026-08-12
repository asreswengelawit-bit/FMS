"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import StyledComponentsRegistry from "@/styles/registry";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <StyledComponentsRegistry>
        {children}
      </StyledComponentsRegistry>
    </NextThemesProvider>
  );
}
