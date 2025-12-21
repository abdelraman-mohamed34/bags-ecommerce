
import { Geist, Geist_Mono, Tajawal } from "next/font/google";
import "./globals.css";
import Wrapper from "./Wrapper.js";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal", // تعريف متغير CSS
});

export const metadata = {
  title: "R&M",
  description: "مطور من قبل عبدالرحمن طالب في كلية الهندسة الزراعية جامعة الأزهر بالقاهرة - +201021079171",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${tajawal.variable} font-tajawal antialiased`}
      >
        <Wrapper>{children}</Wrapper>
      </body>
    </html >
  );
}
