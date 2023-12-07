import Image from "next/image";
import "../globals.css";
export const metadata = {
  title: "Đăng nhập quản trị",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        style={{ backgroundColor: "white" }}
      >
        <div>{children}</div>
      </body>
    </html>
  );
}
