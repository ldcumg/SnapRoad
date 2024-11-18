import GroupList from '@/components/groupList/GroupList';
import RandomImage from '@/components/groupList/RandomImage';

const GroupListPage = async () => {
  return (
    <div className='mx-auto mt-14 flex max-w-[1200px] flex-col items-center pt-4'>
      <RandomImage />
      <GroupList />
    </div>
  );
};

export default GroupListPage;
