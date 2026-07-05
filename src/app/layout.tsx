import type { Metadata } from "next";
import { uiText } from "@/constants/finance";
import "./globals.css";

export const metadata: Metadata = { title: uiText.pageTitle, description: uiText.pageDescription };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
