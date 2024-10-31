'use client';

import { fetchUser } from '@/services/client-action/userAction';
import { useQuery } from '@tanstack/react-query';

export const useUserQuery = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
  });
};
