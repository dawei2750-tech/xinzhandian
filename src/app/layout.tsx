import type { Metadata } from "next";
import { uiText } from "@/constants/finance";
import "./globals.css";
import { LocaleProvider } from "@/i18n/locale-provider";

export const metadata: Metadata = { title: uiText.pageTitle, description: uiText.pageDescription, other: { google: "notranslate" } };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" translate="no"><body><LocaleProvider>{children}</LocaleProvider></body></html>;
}
