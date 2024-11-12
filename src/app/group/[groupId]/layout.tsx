import { TEN_MINUTES_FOR_TANSTACK } from '@/constants/time';
import queryKeys from '@/hooks/queries/queryKeys';
import { getGroupInfo } from '@/services/server-action/groupServerActions';
import { getPostsCoverImagesPerGroup, getPostsImagesPerGroup } from '@/services/server-action/postAction';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';

type GenerateMetadataProps = {
  params: { groupId: string };
};

type GroupDetailLayoutProps = Readonly<{
  children: React.ReactNode;
  params: { groupId: string };
}>;

export const generateMetadata = async ({ params: { groupId } }: GenerateMetadataProps): Promise<Metadata> => {
  const { group_title, group_desc } = await getGroupInfo({ queryKey: [groupId] });

  return {
    title: `${group_title} 상세 페이지`,
    description: group_desc,
  };
};

const GroupDetailLayout = async ({ children, params: { groupId } }: GroupDetailLayoutProps) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.group.posts(groupId),
    queryFn: ({ queryKey }) => getPostsCoverImagesPerGroup({ queryKey }),
    gcTime: TEN_MINUTES_FOR_TANSTACK,
  });

  await queryClient.prefetchInfiniteQuery({
    queryKey: queryKeys.group.postsImages(groupId),
    queryFn: ({ queryKey, pageParam }) => getPostsImagesPerGroup({ queryKey, pageParam }),
    initialPageParam: 0,
    gcTime: TEN_MINUTES_FOR_TANSTACK,
  });

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
};

export default GroupDetailLayout;
