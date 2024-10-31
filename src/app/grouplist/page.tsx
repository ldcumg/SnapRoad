import GroupAddButton from '@/components/groupList/GroupAddButton';
import GroupList from '@/components/groupList/GroupList';
import RandomImage from '@/components/groupList/RandomImage';

const GroupListPage = async () => {
  return (
    <div className='px-[16px] flex flex-col justify-center items-center gap-[21px] mt-[24px]'>
      <RandomImage />
      <GroupAddButton />
      <GroupList />
    </div>
  );
};

export default GroupListPage;
