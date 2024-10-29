import { getProfile } from '@/services/server-action/profilesAction';
import { useQuery } from '@tanstack/react-query';

export const useProfilesQuery = (userId: string) => {
  return useQuery({
    queryKey: ['images', userId],
    queryFn: () => getProfile(userId),
  });
};
