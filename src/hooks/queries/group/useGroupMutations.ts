import queryKeys from '../queryKeys';
import { GroupFormType } from '@/components/makegroup/MakeGroupForm';
import { insertGroupData, insertUserGroupData, updateGroupData } from '@/services/client-action/groupActions';
import { GroupObjType, UpdateGroupObjType, UserGroupType } from '@/types/groupTypes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { UseFormReset } from 'react-hook-form';

type ErrorTypes = {
  code: string | null;
  detail: string | null;
  hint: string | null;
  message: string | null;
};

type InsertGroupType = {
  groupObj: GroupObjType;
  groupImg: File | null;
};

type updateGroupType = {
  groupObj: UpdateGroupObjType;
  groupImg: File | null;
};

const useUpdateGroupMutation = (group_id: string, handleUpdateModal?: () => void) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ groupObj, groupImg }: updateGroupType) => await updateGroupData(groupObj, groupImg),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.group.groupList() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.group.info(group_id) });
      handleUpdateModal && handleUpdateModal();
      router.replace(`/grouplist`);
    },
    onError: (error) => {
      alert('그룹 수정에 실패했습니다. 잠시 후 다시 시도해주세요.');
      console.log('error :>> ', error);
    },
  });
};

const useInsertGroupMutation = (handleUpdateModal?: () => void, reset?: UseFormReset<GroupFormType>) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ groupObj, groupImg }: InsertGroupType) => await insertGroupData(groupObj, groupImg),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.group.groupList() });
      !handleUpdateModal && router.replace('/grouplist');
      handleUpdateModal && handleUpdateModal();
      reset && reset();
    },
    onError: (error) => {
      alert('그룹 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
      console.log('error :>> ', error);
    },
  });
};

const useInsertUserGroupMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userGroupObj: UserGroupType) => await insertUserGroupData(userGroupObj),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.group.groupList() });
      // router.push(`/group/${data?.groupId}`);
    },
    onError: (error: ErrorTypes) => {
      if (error.code === '22P02' || error.code === '23503') {
        alert('해당 그룹에 입장할 수 없습니다. 초대코드를 다시 확인해주세요.');
        console.log('error :>> ', error);
      }
    },
  });
};

export { useInsertGroupMutation, useUpdateGroupMutation, useInsertUserGroupMutation };
