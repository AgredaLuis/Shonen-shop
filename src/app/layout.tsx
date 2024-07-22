import type { Metadata } from "next";
import { inter } from "@/config/fonts";

import "./globals.css";
import { Providers } from "@/components";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    template: "%s - PACHUS | Shop",
    default: "Home - PACHUS | Shop",
  },
  description: "Una tienda virtual de productos PACHUS , haciendo tus idea en realidad",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Toaster position="top-center" reverseOrder={false}  toastOptions={{duration: 5000}}/>
      </body>
    </html>
  );
}
