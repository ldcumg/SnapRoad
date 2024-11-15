// import TopButton from '@/components/_common/TopButton';
import LogoUserHeader from '@/components/layout/LogoUserHeader';
import queryKeys from '@/hooks/queries/queryKeys';
import { getInfiniteGroupData, getRandomPosts } from '@/services/server-action/groupServerActions';
import { TopButton } from '@/stories/TopButton';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '내 그룹 리스트',
  description: '내 그룹 목록을 확인하고, 그룹에서 작성된 랜덤 게시물을 확인해봐요',
};

type Props = Readonly<{ children: React.ReactNode }>;

const GroupListLayout = async ({ children }: Props) => {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.group.groupRandomPosts(),
      queryFn: () => {
        const randomPosts = getRandomPosts();
        return randomPosts;
      },
    }),
    queryClient.prefetchInfiniteQuery({
      queryKey: queryKeys.group.groupList(),
      queryFn: ({ pageParam }) => {
        const groupData = getInfiniteGroupData({ pageParam });
        return groupData;
      },
      retry: 0,
      initialPageParam: 0,
    }),
  ]);

  return (
    <div>
      <TopButton />
      <LogoUserHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>
    </div>
  );
};

export default GroupListLayout;
