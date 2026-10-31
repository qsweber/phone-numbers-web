import { ReactNode } from "react";
import { Work_Sans } from "next/font/google";
import "./globals.css";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={workSans.variable}>
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Get a memorable, alphanumeric representation of your phone number."
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <title>Phone Numbers</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
