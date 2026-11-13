import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/auth-context";
import { StorefrontLayout } from "@/components/common/StorefrontLayout";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HMONG.MALL | Sàn Thương Mại Thời Trang & Thủ Công Hmong",
  description:
    "Sàn thương mại điện tử chuyên trang phục Hmong cách tân, áo khoác thổ cẩm, may đo cá nhân hóa, khăn batik sáp ong và trang sức bạc Sa Pa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#faf8f5] text-stone-900">
        <AuthProvider>
          <StorefrontLayout>{children}</StorefrontLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
