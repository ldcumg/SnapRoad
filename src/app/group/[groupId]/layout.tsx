import queryKeys from '@/hooks/queries/queryKeys';
import { getGroupInfo } from '@/services/server-action/groupServerActions';
import { getPostsCoverImagesPerGroup } from '@/services/server-action/postAction';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';

type GenerateMetadataProps = {
  params: { groupId: string };
};

export const generateMetadata = async ({ params: { groupId } }: GenerateMetadataProps): Promise<Metadata> => {
  const { group_title, group_desc } = await getGroupInfo({ queryKey: [groupId] });

  return {
    title: `${group_title} 상세 페이지`,
    description: group_desc,
  };
};

type GroupDetailLayoutProps = Readonly<{
  children: React.ReactNode;
  params: { groupId: string };
}>;

const GroupDetailLayout = async ({ children, params: { groupId } }: GroupDetailLayoutProps) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.group.posts(groupId),
    queryFn: ({ queryKey }) => getPostsCoverImagesPerGroup({ queryKey }),
  });

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
};

export default GroupDetailLayout;
