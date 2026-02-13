import "./globals.css";
import "../scss/main.scss";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import ToasterProvider from "@/components/toasterProvider";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "Golden Bulls Learning Academy Private Limited",
  description:
    "Master forex, crypto, and trading strategies with Golden Bulls. Expert-led courses for beginners to advanced traders.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ToasterProvider />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
