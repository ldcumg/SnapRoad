'use client';

import queryKeys from '../queryKeys';
import { fetchUser } from '@/services/client-action/userAction';
import { getSession, getUserData } from '@/services/server-action/authActions';
import { UserData } from '@/types/userTypes';
import { useQuery } from '@tanstack/react-query';

export const useUserQuery = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
  });
};

export const useUserInfoQuery = () => {
  return useQuery({
    queryKey: queryKeys.user.userInfo(),
    queryFn: async () => {
      const user = await getSession();
      let userInfo: UserData = null;
      if (user?.id) {
        userInfo = await getUserData(user.id);
      }
      return userInfo;
    },
  });
};
