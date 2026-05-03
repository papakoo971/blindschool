import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "blindschool",
  description: "교직원 전용 익명 커뮤니티와 업무 소통 허브",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
