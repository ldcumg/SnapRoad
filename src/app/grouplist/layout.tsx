import ScrollReactHeader from '@/components/_common/ScrollReactHeader';
import TopButton from '@/components/_common/TopButton';
import LogoUserHeader from '@/components/layout/LogoUserHeader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Next.js Project',
  description: 'A Next.js project with TypeScript and TailwindCSS.',
  keywords: 'Next.js, Typescript, TailwindCSS',
};

type Props = Readonly<{ children: React.ReactNode }>;

const GroupListLayout = ({ children }: Props) => {
  return (
    <>
      <TopButton />
      <ScrollReactHeader>
        <LogoUserHeader />
      </ScrollReactHeader>
      {children}
    </>
  );
};

export default GroupListLayout;
