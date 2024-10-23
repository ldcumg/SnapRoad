import { insertGroupData, insertUserGroupData } from '@/services/client-action/groupActions';
import { GroupObjType, UserGroupType } from '@/types/groupTypes';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

// TODO - invalidate필요시 쿼리키 추가 필요
const useInsertGroupMutation = () => {
  return useMutation({
    mutationFn: async (groupObj: GroupObjType) => await insertGroupData(groupObj),
    onSuccess: (data) => {
      // console.log('data :>> ', data);
    },
    onError: (error) => console.log('error :>> ', error),
  });
};

const useInsertUserGroupMutation = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (userGroupObj: UserGroupType) => await insertUserGroupData(userGroupObj),
    onSuccess: (data) => {
      router.push(`/group/${data?.groupId}`);
    },
    onError: (error) => console.log('error :>> ', error),
  });
};

export { useInsertGroupMutation, useInsertUserGroupMutation };
