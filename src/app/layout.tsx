import type { Metadata } from "next";
import { Doto, DotGothic16 } from "next/font/google";
import "./globals.css";

const dotGothic = DotGothic16({
  weight: "400",
  preload: false,
  variable: "--font-dot-jp",
});

const doto = Doto({
  subsets: ["latin"],
  variable: "--font-dot-latin",
});

export const metadata: Metadata = {
  title: "nekoist診断 | あなたの猫愛はどのタイプ？",
  description:
    "36の究極の二択から、あなたに宿る猫愛のかたちを16タイプで診断します。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className={`${dotGothic.variable} ${doto.variable}`}>
      <body>{children}</body>
    </html>
  );
}
