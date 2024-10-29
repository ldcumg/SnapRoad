import { fetchUserSession } from '@/services/client-action/sessionAction';
import { useQuery } from '@tanstack/react-query';

export const useSessionQuery = () => {
  return useQuery({
    queryKey: ['userSession'],
    queryFn: fetchUserSession,
  });
};
