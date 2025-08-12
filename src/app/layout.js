import "./globals.css";


export const metadata = {
  title: "DT-LOGS Gaspoll",
  description: "DT-LOGS Gaspoll App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
