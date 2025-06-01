import type { Metadata } from "next";
import "@/styles/globals.css";
import React from "react";
import Providers from "@/components/Providers";



export const metadata: Metadata = {
  title: "ManagerApp",
  description: "Created by Yeras",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
            {children}
        </Providers>
      </body>
    </html>
  );
}
