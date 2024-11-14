import { PostPositioningProvider } from '@/components/providers/GroupDetailModeProvider';
import QueryProvider from '@/components/providers/QueryProvider';
import '@/lib/styles/globals.css';
import * as Sentry from '@sentry/browser';
import type { Metadata } from 'next';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  release: 'snpaRoad@2.3.12',
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
  tracesSampleRate: 1.0,
  tracePropagationTargets: [
    'localhost', // 개발 환경
    /^https:\/\/snaproad\.co\.kr\/api/, // SnapRoad의 API 엔드포인트
  ],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

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
          <PostPositioningProvider>
            <main className='h-full w-full'>{children}</main>
          </PostPositioningProvider>
        </QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
