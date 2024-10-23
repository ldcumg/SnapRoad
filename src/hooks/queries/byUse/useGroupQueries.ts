import { getGroupDetails } from '@/services/server-action/groupServerActions';
import { useQuery } from '@tanstack/react-query';

const useGroupDetailQuery = (group_id: string) => {
  return useQuery({
    queryKey: ['groupDetail', group_id],
    queryFn: () => getGroupDetails(group_id),
  });
};

export { useGroupDetailQuery };
