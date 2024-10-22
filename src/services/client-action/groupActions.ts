import { GroupObjType, UserGroupType } from '@/types/groupTypes';
import browserClient from '@/utils/supabase/client';

const insertGroupData = async (groupObj: GroupObjType) => {
  const state = await browserClient.from('group').insert([groupObj]);
  if (state.status !== 201) throw state.error;
  else if (state.status === 201) return { data: state.data, error: state.error };
};

const insertUserGroupData = async (userGroupObj: UserGroupType) => {
  const state = await browserClient.from('user_group').insert([userGroupObj]);
  if (state.status !== 201) throw state.error;
  else if (state.status === 201) return { data: state.data, error: state.error, groupId: userGroupObj.group_id };
};

export { insertGroupData, insertUserGroupData };
