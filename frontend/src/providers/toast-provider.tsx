"use client";

import { Toaster } from "sonner";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "white",
            border: "1px solid #e2e8f0",
            color: "#0f172a",
          },
          className: "toast",
          descriptionClassName: "toast-description",
        }}
        closeButton
        richColors
      />
    </>
  );
}