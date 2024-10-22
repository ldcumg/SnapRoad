import { GroupObjType, UserGroupType } from '@/types/groupTypes';
import browserClient from '@/utils/supabase/client';

const insertGroupData = async (groupObj: GroupObjType) => {
  const state = await browserClient.from('group').insert(groupObj);
  if (state.status !== 201) throw state.error;
  else if (state.status === 201) return { data: state.data, error: state.error };
};

const insertUserGroupData = async (userGroupObj: UserGroupType) => {
  const state = await browserClient.from('user_group').insert(userGroupObj);
  if (state.status !== 201) throw state.error;
  else if (state.status === 201) return { data: state.data, error: state.error, groupId: userGroupObj.group_id };
};

const checkMemberexist = async (group_id: string, userId: string) => {
  const state = await browserClient
    .from('user_group')
    .select('user_id, group_id')
    .eq('group_id', group_id)
    .eq('user_id', userId);
  if (state.status !== 200) throw state.error;
  return { data: state.data, error: state.error };
};

export { insertGroupData, insertUserGroupData, checkMemberexist };
