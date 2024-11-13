import { GroupDetailModeProvider } from '@/components/providers/GroupDetailModeProvider';
import QueryProvider from '@/components/providers/QueryProvider';
import '@/styles/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Snap Road',
  description: 'Snap-Road: 우리들의 여행기록',
  keywords: ['snaproad', 'snap-road', '여행', '기록', '그룹'],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://snaproad.co.kr',
    siteName: 'Snap Road',
    title: '스냅로드',
    description: 'Snap-Road: 우리들의 여행기록',
    images: 'https://www.snaproad.co.kr/images/ogImage/og_image.jpg',
    // images: [
    //   {
    //     url: 'https://www.snaproad.co.kr/images/og-image.jpg',
    //     width: 1200,
    //     height: 630,
    //     alt: 'Snap Road',
    //   },
    // ],
  },
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
          <GroupDetailModeProvider>
            <main className='h-full w-full'>{children}</main>
          </GroupDetailModeProvider>
        </QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
