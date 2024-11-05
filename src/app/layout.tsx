import Header from '@/components/layout/Header';
import QueryProvider from '@/components/providers/QueryProvider';
import '@/styles/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Snap Road',
  description: 'Snap-Road: 우리들의 여행기록',
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
        </QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
