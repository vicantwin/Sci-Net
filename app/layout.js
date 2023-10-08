import Navbar from "./components/Navbar";
import "./globals.css";
import { AuthContextProvider } from "./firebase/context/AuthContext";
import { Toaster } from "sonner";
import { Gabarito } from "next/font/google";

const gabarito = Gabarito({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Open Sci-net",
  description:
    "Open Sci-net, a 'NASA Space Apps project' by OOW_Hidden_Talent_Revealers, on the challenge 'A Marketplace for Open Science Projects'",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={gabarito.className}>
      <body>
        <AuthContextProvider>
          <Navbar />
          {children}
          <Toaster theme="system" richColors />
        </AuthContextProvider>
      </body>
    </html>
  );
}
