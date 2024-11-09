import { GroupDetailModeProvider } from '@/components/providers/GroupDetailModeProvider';
import QueryProvider from '@/components/providers/QueryProvider';
import '@/styles/globals.css';
import { GroupDetailMode } from '@/types/groupTypes';
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
          <GroupDetailModeProvider>
            <main className='h-full w-full'>{children}</main>
          </GroupDetailModeProvider>
        </QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
