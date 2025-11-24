
import React from "react";
import { inter, workSans, openSans } from "./layout";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html lang="en" className={`${inter.variable} ${workSans.variable} ${openSans.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
