"use client";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <header>haha</header>
        {children}
        <footer>footer</footer>
      </body>
    </html>
  );
}
