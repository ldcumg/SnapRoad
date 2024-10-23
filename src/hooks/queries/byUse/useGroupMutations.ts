import { insertGroupData, insertUserGroupData } from '@/services/client-action/groupActions';
import { GroupObjType, UserGroupType } from '@/types/groupTypes';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

type ErrorTypes = {
  code: string | null;
  detail: string | null;
  hint: string | null;
  message: string | null;
};

// TODO - invalidate필요시 쿼리키 추가 필요
type InsertGroupType = {
  groupObj: GroupObjType;
  groupImg: File | null;
};
//TODO - invalidate필요시 쿼리키 추가 필요
const useInsertGroupMutation = () => {
  return useMutation({
    mutationFn: async ({ groupObj, groupImg }: InsertGroupType) => await insertGroupData(groupObj, groupImg),
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
    onError: (error: ErrorTypes) => {
      if (error.code === '22P02' || error.code === '23503')
        alert('해당 그룹에 입장할 수 없습니다. 초대코드를 다시 확인해주세요.');
      console.log('error :>> ', error);
    },
  });
};

export { useInsertGroupMutation, useInsertUserGroupMutation };
