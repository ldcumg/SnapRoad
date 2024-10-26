import GroupList from '@/components/groupList/GroupList';
import RandomImage from '@/components/groupList/RandomImage';
import { getGroupPostLists } from '@/services/server-action/groupServerActions';
import { createClient } from '@/utils/supabase/server';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

const GroupListPage = async () => {
  // const queryClient = new QueryClient({
  //   defaultOptions: {
  //     queries: {
  //       staleTime: 1000 * 60 * 10,
  //     },
  //   },
  // });
  // const supabase = createClient();
  // const { data } = await supabase.auth.getUser();

  // await queryClient.prefetchQuery({
  //   queryKey: ['groupImages'],
  //   queryFn: async () => {
  //     let images = [];
  //     if (data.user?.id) {
  //       const userId = data.user.id;
  //       const belongGroups = await getGroupPostLists(userId);
  //       console.log('belongGroups :>> ', belongGroups);
  //     }
  //     return;
  //   },
  // });
  return (
    <div className='px-[16px] flex flex-col justify-center items-center'>
      {/* <HydrationBoundary state={dehydrate(queryClient)}> */}
      <RandomImage />
      {/* </HydrationBoundary> */}
      <GroupList />
    </div>
  );
};

export default GroupListPage;
