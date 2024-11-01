import { getSession, getUserData } from '@/services/server-action/authActions';
import { useQuery } from '@tanstack/react-query';

/** 사용자 세션 */
export const useGetUserSession = () => {
  return useQuery({
    queryKey: ['userSession'],
    queryFn: getSession,
  });
};
