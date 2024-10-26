import { getSignedImgUrls } from './server-action/getSignedImgUrls';
import { GroupObjType, GroupWithCounts, UserGroupType } from '@/types/groupTypes';
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

const getGroupSignedImageUrls = async (groups: GroupWithCounts[]) => {
  const groupImages = groups.map((group) => group.group_image_url);
  return await getSignedImgUrls('group_image', 1000 * 60 * 10, groupImages);
};

export { makeGroupDataToObj, makeUserGroupDataToObj, getGroupSignedImageUrls };
