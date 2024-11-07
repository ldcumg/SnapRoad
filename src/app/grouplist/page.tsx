import GroupList from '@/components/groupList/GroupList';
import RandomImage from '@/components/groupList/RandomImage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '내 그룹 리스트',
  description: '내 그룹 목록을 확인하고, 그룹에서 작성된 랜덤 게시물을 확인해봐요',
};

const GroupListPage = async () => {
  return (
    <div className='mx-auto mt-14 flex max-w-5xl flex-col items-center pt-4'>
      <RandomImage />
      <GroupList />
    </div>
  );
};

export default GroupListPage;
