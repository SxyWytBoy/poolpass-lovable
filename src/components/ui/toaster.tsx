
import { Toaster as SonnerToaster } from "sonner";
import React from "react";

export function Toaster() {
  return (
    <SonnerToaster 
      position="bottom-right" 
      toastOptions={{
        style: {
          background: "white",
          color: "black",
          border: "1px solid #e2e8f0",
        },
      }}
    />
  );
}
