import "./globals.css";

export const metadata = {
  title: "ExpatEase | Local Assistance in Ecuador",
  description: "Your trusted local assistant in Ecuador.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
