import { getGroupUsersCount, GroupListResponseType } from './client-action/groupActions';
import { getSignedImgUrl } from './server-action/getSignedImgUrl';
import { GroupObjType, UserGroupType } from '@/types/groupTypes';
import { FieldValues } from 'react-hook-form';

const makeGroupDataToObj = (value: FieldValues): GroupObjType => {
  return {
    group_id: crypto.randomUUID(),
    group_title: value.groupTitle,
    group_desc: value.groupDesc,
    group_invite_code: crypto.randomUUID(),
    group_status: 'recruiting',
    created_at: new Date(),
  };
};

const makeUserGroupDataToObj = (userId: string, is_owner: boolean, group_id: string): UserGroupType => {
  return {
    user_id: userId,
    group_id,
    is_owner,
    joined_at: new Date(),
  };
};

const getUserCount = async (groups: GroupListResponseType[]) => {
  return await Promise.all(
    groups.map(async (group) => {
      return await getGroupUsersCount(group.group_data.group_id);
    }),
  );
};

const getGroupSignedImageUrl = async (groups: GroupListResponseType[]) => {
  return await Promise.all(
    groups.map(async (group) => {
      return await getSignedImgUrl('group_image', 1000 * 60 * 10, group.group_data.group_image_url);
    }),
  );
};

export { makeGroupDataToObj, makeUserGroupDataToObj, getUserCount, getGroupSignedImageUrl };
