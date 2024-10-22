import { GroupObjType, UserGroupType } from '@/types/groupTypes';
import browserClient from '@/utils/supabase/client';

const insertGroupData = async (groupObj: GroupObjType, groupImg: File | null) => {
  //NOTE - 이미지가 File형태로 넘어오면 storage업로드 후 publicUrl로 설정해주고, null로 넘어오면 기본 이미지로 설정되도록 구현
  let group_thumbnail = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/group_image/group_default_thumbnail.png`;
  if (!!groupImg) {
    const { data, error } = await browserClient.storage
      .from('group_image')
      .upload(`${groupObj.group_id}_thumbnail`, groupImg);
    if (error) throw error;
    const {
      data: { publicUrl },
    } = browserClient.storage.from('group_image').getPublicUrl(`${groupObj.group_id}_thumbnail`);
    group_thumbnail = publicUrl;
  }
  const insertState = await browserClient.from('group').insert({ ...groupObj, group_image_url: group_thumbnail });
  if (insertState.status !== 201) throw insertState.error;
  else if (insertState.status === 201) return { data: insertState.data, error: insertState.error };
};

const insertUserGroupData = async (userGroupObj: UserGroupType) => {
  const state = await browserClient.from('user_group').insert(userGroupObj);
  if (state.status !== 201) throw state.error;
  else if (state.status === 201) return { data: state.data, error: state.error, groupId: userGroupObj.group_id };
};

export { insertGroupData, insertUserGroupData };
