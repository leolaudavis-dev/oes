import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat, Gochi_Hand } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const flowerGirl = localFont({
  src: "./fonts/FlowerGirl-Regular.ttf",
  variable: "--font-flowergirl",
});

const cakeNTruffles = localFont({
  src: "./fonts/CakeNTruffles.ttf",
  variable: "--font-cake",
});

const starborn = localFont({
  src: "./fonts/Starborn.ttf",
  variable: "--font-starborn",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const gochiHand = Gochi_Hand({
  variable: "--font-gochi",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Scrapbook",
  description: "A scrapbook of the week",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} ${gochiHand.variable} ${flowerGirl.variable} ${cakeNTruffles.variable} ${starborn.variable}`}
    >
      <body>
        {/* Leopard-print border framing the page */}
        <div className="frameTop" aria-hidden />
        <div className="frameBottom" aria-hidden />
        <div className="frameLeft" aria-hidden />
        <div className="frameRight" aria-hidden />

        <div className="marqueeBar" role="marquee" aria-label="art is a verb not a noun">
          <div className="marqueeTrack">
            {Array.from({ length: 2 }).map((_, group) => (
              <span className="marqueeGroup" key={group} aria-hidden={group === 1}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <span className="marqueeItem" key={i}>
                    art is a verb not a noun
                    <span className="marqueeStar" aria-hidden>
                      ✿
                    </span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
