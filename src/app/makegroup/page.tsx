import MakeGroupForm from '@/components/makegroup/MakeGroupForm';
import { Metadata } from 'next';

type Props = {
  searchParams: { update_for?: string };
};

export const metadata: Metadata = {
  title: '그룹 생성 페이지',
  description: '우리 그룹을 만들어 추억을 서로 공유해봐요!',
};

const MakeGroupPage = ({ searchParams: { update_for } }: Props) => {
  return <MakeGroupForm update_for={update_for} />;
};

export default MakeGroupPage;
