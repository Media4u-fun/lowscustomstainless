import type { Metadata } from "next";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "Low's Custom Stainless | Commercial Fabrication & Installation",
    template: "%s | Low's Custom Stainless",
  },
  description:
    "33 years of elite commercial stainless steel fabrication and installation. Trusted by Yard House, In-N-Out, SoFi Stadium, Apple, and Google. M5 finish specialists.",
  keywords: [
    "custom stainless steel",
    "commercial fabrication",
    "restaurant stainless",
    "M5 finish",
    "bar tops",
    "commercial kitchen",
    "Low's Custom Stainless",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ConvexClientProvider>
          {children}
          <Toaster
            theme="dark"
            toastOptions={{
              style: {
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                color: "#f5f5f5",
              },
            }}
          />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
