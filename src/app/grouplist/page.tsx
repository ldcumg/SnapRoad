import GroupList from '@/components/groupList/GroupList';
import RandomImage from '@/components/groupList/RandomImage';

const GroupListPage = async () => {
  return (
    <div className='px-[16px] flex flex-col justify-center items-center'>
      <RandomImage />
      <GroupList />
    </div>
  );
};

export default GroupListPage;
