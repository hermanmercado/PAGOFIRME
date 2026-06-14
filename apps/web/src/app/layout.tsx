import type { Metadata } from 'next';
import { Inter, Syne } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const syne = Syne({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-syne',
});

export const metadata: Metadata = {
  title: 'PagoFirme — Pagos QR sin comisiones',
  description: 'Pasarela de pagos QR multi-riel para Bolivia. Cero comisiones.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${inter.variable} ${syne.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
