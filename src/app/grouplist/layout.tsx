// import TopButton from '@/components/_common/TopButton';
import LogoUserHeader from '@/components/layout/LogoUserHeader';
import { TopButton } from '@/stories/TopButton';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '내 그룹 리스트',
  description: '내 그룹 목록을 확인하고, 그룹에서 작성된 랜덤 게시물을 확인해봐요',
};

type Props = Readonly<{ children: React.ReactNode }>;

const GroupListLayout = ({ children }: Props) => {
  return (
    <>
      <TopButton />
      <LogoUserHeader />
      {children}
    </>
  );
};

export default GroupListLayout;
