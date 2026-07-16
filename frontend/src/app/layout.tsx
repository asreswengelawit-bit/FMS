import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
