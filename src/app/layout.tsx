import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "nekoist診断 | あなたの猫愛はどのタイプ？",
  description:
    "36の究極の二択から、あなたに宿る猫愛のかたちを16タイプで診断します。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
