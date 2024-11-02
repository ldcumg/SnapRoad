import MakeGroupHeader from '@/components/makegroup/MakeGroupHeader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Next.js Project',
  description: 'A Next.js project with TypeScript and TailwindCSS.',
  keywords: 'Next.js, Typescript, TailwindCSS',
};

type Props = Readonly<{ children: React.ReactNode }>;

const GroupDetailLayout = ({ children }: Props) => {
  return (
    <>
      <MakeGroupHeader />
      {children}
    </>
  );
};

export default GroupDetailLayout;
