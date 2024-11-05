import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import QueryProvider from '@/components/providers/QueryProvider';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';

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
      <body className={`font-sans`}>
        <QueryProvider>
          <Header />
          <main className='w-full h-full'>{children}</main>
          {/* <Footer /> */}
        </QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
