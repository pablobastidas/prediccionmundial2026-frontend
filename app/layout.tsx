import './globals.css';
import { Plus_Jakarta_Sans, Sora } from 'next/font/google';

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  weight: ['400', '500', '600', '700', '800']
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  weight: ['600', '700', '800']
});

export const metadata = {
  title: 'Mundial 48 | La Experiencia Oficial',
  description: 'Compite con tus amigos en la mejor polla social del Mundial United 2026. Predicciones, grupos y calendario real.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${plusJakarta.variable} ${sora.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
