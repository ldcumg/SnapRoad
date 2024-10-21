import '@/styles/globals.css';

import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import QueryProvider from '@/components/providers/QueryProvider';

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
      <head>
        <script
          type='text/javascript'
          src='//dapi.kakao.com/v2/maps/sdk.js?appkey=%NEXT_PUBLIC_KAKAO_MAPS_KEY%&libraries=services,clusterer'
        />
      </head>
      <body className={`${inter.className}`}>
        <QueryProvider>
          <main>{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
