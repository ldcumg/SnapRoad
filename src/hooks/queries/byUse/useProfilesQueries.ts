import { getProfile } from '@/services/server-action/profilesAction';
import { useQuery } from '@tanstack/react-query';

export const useProfilesQuery = (userId: string) => {
  return useQuery({
    queryKey: ['profiles', userId],
    queryFn: () => getProfile(userId),
  });
};
