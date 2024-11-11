import buckets from '@/constants/buckets';
import { GroupObjType, UpdateGroupObjType, UserGroupType } from '@/types/groupTypes';
import browserClient from '@/utils/supabase/client';

const uploadDefaultGroupImg = async (group_id: string) => {
  const defaultImgRes = await fetch('/images/group_default_thumbnail.png');
  const defaultImgBlob = await defaultImgRes.blob();
  const { data, error } = await browserClient.storage
    .from(buckets.groupImage())
    .upload(`${group_id}_thumbnail`, defaultImgBlob);
  return { data, error };
};

const uploadGroupImg = async (groupImg: File, group_id: string) => {
  const { data, error } = await browserClient.storage
    .from(buckets.groupImage())
    .upload(`${group_id}_thumbnail`, groupImg);
  return { data, error };
};

const updateDefaultGroupImg = async (group_id: string) => {
  const defaultImgRes = await fetch('/images/group_default_thumbnail.png');
  const defaultImgBlob = await defaultImgRes.blob();
  const { data, error } = await browserClient.storage
    .from(buckets.groupImage())
    .upload(`${group_id}_thumbnail`, defaultImgBlob, {
      upsert: true,
    });
  return { data, error };
};
const updateGroupImg = async (groupImg: File, group_id: string) => {
  const { data, error } = await browserClient.storage
    .from(buckets.groupImage())
    .upload(`${group_id}_thumbnail`, groupImg, {
      upsert: true,
    });
  return { data, error };
};

const updateGroupData = async (groupObj: UpdateGroupObjType, groupImg: File | null) => {
  //NOTE - 그룹 이미지가 사라졌을 시 public의 기본썸네일 사용, 있을 시 업로드한 이미지 사용
  if (!groupImg) {
    const { data, error } = await updateDefaultGroupImg(groupObj.group_id);
    if (error) throw error;
  } else {
    const { data, error } = await updateGroupImg(groupImg, groupObj.group_id);
    if (error) throw error;
  }
  const updateState = await browserClient.from('group').update(groupObj).eq('group_id', groupObj.group_id);
  if (updateState.status !== 204) throw updateState.error;
  else if (updateState.status === 204) return { data: updateState.data, error: updateState.error };
};

const insertGroupData = async (groupObj: GroupObjType, groupImg: File | null) => {
  //NOTE - 그룹 이미지가 없을 시 public의 기본썸네일 사용, 있을 시 업로드한 이미지 사용
  if (!groupImg) {
    const { data, error } = await uploadDefaultGroupImg(groupObj.group_id);
    if (error) throw error;
  } else {
    const { data, error } = await uploadGroupImg(groupImg, groupObj.group_id);
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

type GroupListType = {
  pageParam: number;
  userId: string;
};

export type GroupListResponseType = {
  id: number;
  user_id: string;
  group_id: string;
  userCount?: number | undefined;
  group_data: {
    group_id: string;
    group_title: string;
    group_desc: string;
    group_image_url: string;
    updated_at: Date;
  };
};

const getGroupListByPage = async ({ pageParam, userId }: GroupListType) => {
  const state = await browserClient
    .from('user_group')
    .select(
      `
      id,
      user_id,
      group_id,
      group_data: group(
        group_id,
        group_title,
        group_desc,
        group_image_url,
        updated_at
      )`,
    )
    .eq('user_id', userId)
    .range(pageParam * 6, pageParam * 5 + 5);
  if (state.status !== 200) throw state.error;
  return state.data as GroupListResponseType[] | null;
};

const getGroupUsersCount = async (groupId: string) => {
  const state = await browserClient.from('user_group').select('user_id').eq('group_id', groupId);
  if (state.status !== 200) throw state.error;
  return state.data?.length;
};

export { updateGroupData, insertGroupData, insertUserGroupData, getGroupListByPage, getGroupUsersCount };
