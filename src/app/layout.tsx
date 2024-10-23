import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import QueryProvider from '@/components/providers/QueryProvider';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Next.js Project',
  description: 'A Next.js project with TypeScript and TailwindCSS.',
  keywords: 'Next.js, Typescript, TailwindCSS',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html
      lang='ko'
      suppressHydrationWarning
    >
      <body className={`${inter.className}`}>
        <QueryProvider>
          <Header />
          <main className='w-full h-full'>{children}</main>
          <Footer />
        </QueryProvider>
        <Script
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_KEY}&libraries=services,clusterer&autoload=false`}
          strategy='beforeInteractive'
        />
      </body>
    </html>
  );
};

export default RootLayout;
