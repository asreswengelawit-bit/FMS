import type { Metadata } from "next";
// Tailwind + the Shadcn design tokens. Loaded before the styled-components
// registry so component-level styles still win over the utility base layer.
import "./globals.css";
import StyledComponentsRegistry from "@/styles/registry";
import { GlobalStyle } from "@/styles/global-style";
import { ToastProvider } from "@/providers/toast-provider";

export const metadata: Metadata = {
  title: "INSA-ERP",
  description: "Enterprise Resource Planning",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <GlobalStyle />
          <ToastProvider>
            {children}
          </ToastProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
