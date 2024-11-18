'use client';

import { usePathname } from 'next/navigation';

const LayoutMain = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isGroupPage = /^\/group\/[^/]+$/.test(pathname);
  const isGroupPostPage = /^\/group\/[^/]+\/post$/.test(pathname);

  console.log('현재 경로:', pathname);
  console.log('isGroupPage:', isGroupPage);
  console.log('isGroupPostPage:', isGroupPostPage);

  return (
    <main
      className={`h-full w-full ${
        isGroupPage ? '' : isGroupPostPage ? 'mx-auto max-w-[1200px]' : 'mx-auto max-w-[1200px]'
      }`}
    >
      {children}
    </main>
  );
};

export default LayoutMain;
