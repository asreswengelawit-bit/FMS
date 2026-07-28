import type { Metadata } from "next";
import StyledComponentsRegistry from "@/styles/registry";
import { GlobalStyle } from "@/styles/global-style";

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
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
