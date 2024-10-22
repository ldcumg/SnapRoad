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

export { makeGroupDataToObj, makeUserGroupDataToObj };
