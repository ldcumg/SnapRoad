import MakeGroupHeader from '@/components/makegroup/MakeGroupHeader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '그룹 생성하기',
  description: '그룹을 생성하여 여행을 기록해보세요!',
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
