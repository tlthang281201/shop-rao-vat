import Image from "next/image";
import "../globals.css";
export const metadata = {
  title: "Đăng nhập quản trị",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div>{children}</div>
      </body>
    </html>
  );
}
