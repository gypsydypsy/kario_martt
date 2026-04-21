import "../styles/main.scss";

export const metadata = {
  title: "Kario Mart",
  description: "For learning purpose only",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning >
      <body>
        {children}
      </body>
    </html>
  );
}
