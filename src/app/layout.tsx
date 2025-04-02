"use client";


import { MyContextProvider } from "../app/context/MyContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MyContextProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </MyContextProvider>
  );
}
