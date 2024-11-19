import { getSignedImgUrls } from './server-action/getSignedImgUrls';
import buckets from '@/constants/buckets';
import { TEN_MINUTES_FOR_SUPABASE } from '@/constants/time';
import { GroupObjType, GroupWithCounts, UserGroupType } from '@/types/groupTypes';
import { FieldValues } from 'react-hook-form';

const makeGroupDataForUpdate = (value: FieldValues, update_for: string) => {
  return {
    group_id: update_for,
    updated_at: new Date().toISOString(),
    group_title: value.groupTitle,
    group_desc: value.groupDesc,
  };
};
const makeGroupDataToObj = (value: FieldValues): GroupObjType => {
  return {
    group_id: crypto.randomUUID(),
    group_title: value.groupTitle,
    group_desc: value.groupDesc,
    group_invite_code: crypto.randomUUID(),
    group_status: 'recruiting',
    created_at: new Date().toISOString(),
  };
};

const makeUserGroupDataToObj = (userId: string, is_owner: boolean, group_id: string): UserGroupType => {
  return {
    user_id: userId,
    group_id,
    is_owner,
    joined_at: new Date().toISOString(),
  };
};

const getGroupSignedImageUrls = async (groups: GroupWithCounts[]) => {
  const groupImages = groups.map((group) => group.group_image_url);
  return await getSignedImgUrls(buckets.groupImage, TEN_MINUTES_FOR_SUPABASE, groupImages);
};

export { makeGroupDataForUpdate, makeGroupDataToObj, makeUserGroupDataToObj, getGroupSignedImageUrls };
