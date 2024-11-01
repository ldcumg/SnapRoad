import TopButton from '@/components/_common/TopButton';
import GroupListHeader from '@/components/groupList/GroupListHeader';
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
      <TopButton />
      <GroupListHeader />
      {children}
    </>
  );
};

export default GroupDetailLayout;
