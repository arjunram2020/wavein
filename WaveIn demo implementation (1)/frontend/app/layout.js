import "./globals.css";
import { Instrument_Serif, Hanken_Grotesk } from "next/font/google";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-hanken-grotesk",
  display: "swap",
});

export const metadata = {
  title: "WaveIn — WC26 Atlanta",
  description: "Staggered arrival waves for stadium events. Less gridlock, less CO₂.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${hankenGrotesk.variable}`}
      style={{
        // Map next/font CSS vars onto the design-system tokens.
        "--font-serif": `var(--font-instrument-serif), Georgia, serif`,
        "--font-sans": `var(--font-hanken-grotesk), system-ui, sans-serif`,
      }}
    >
      <body>{children}</body>
    </html>
  );
}
