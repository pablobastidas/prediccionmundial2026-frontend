import '@/styles/wc-styles.css';
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
    <html lang="es" className={`${plusJakarta.variable} ${sora.variable} bg-wc-dark scroll-smooth`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body className="bg-wc-dark min-h-screen font-sans text-wc-white overflow-x-hidden selection:bg-wc-sky selection:text-wc-dark">
        {/* Main background glow effects */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-wc-blue/10 rounded-full blur-[140px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-wc-red/5 rounded-full blur-[120px]"></div>
        </div>
        
        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
