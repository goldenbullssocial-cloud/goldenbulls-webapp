import "./globals.css";
import '../scss/main.scss';
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export const metadata = {
  title: "Golden Bulls Learning Academy Private Limited",
  description: "Golden Bulls Learning Academy Private Limited",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body >
        {children}
      </body>
    </html>
  );
}
