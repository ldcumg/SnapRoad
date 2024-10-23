import { GroupObjType, UserGroupType } from '@/types/groupTypes';
import browserClient from '@/utils/supabase/client';

const insertGroupData = async (groupObj: GroupObjType, groupImg: File | null) => {
  //NOTE - 그룹 이미지가 없을 시 public의 기본썸네일 사용, 있을 시 업로드한 이미지 사용
  if (!groupImg) {
    const defaultImgRes = await fetch('/images/group_default_thumbnail.png');
    const defaultImgBlob = await defaultImgRes.blob();
    const { data, error } = await browserClient.storage
      .from('group_image')
      .upload(`${groupObj.group_id}_thumbnail`, defaultImgBlob);
    if (error) throw error;
  } else {
    const { data, error } = await browserClient.storage
      .from('group_image')
      .upload(`${groupObj.group_id}_thumbnail`, groupImg);
    if (error) throw error;
  }

  const insertState = await browserClient
    .from('group')
    .insert({ ...groupObj, group_image_url: `${groupObj.group_id}_thumbnail` });
  if (insertState.status !== 201) throw insertState.error;
  else if (insertState.status === 201) return { data: insertState.data, error: insertState.error };
};

const insertUserGroupData = async (userGroupObj: UserGroupType) => {
  const state = await browserClient.from('user_group').insert(userGroupObj);
  if (state.status !== 201) throw state.error;
  else if (state.status === 201) return { data: state.data, error: state.error, groupId: userGroupObj.group_id };
};

export { insertGroupData, insertUserGroupData };
