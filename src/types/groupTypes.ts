export type GroupObjType = {
  group_id: string;
  group_title: string;
  group_desc: string;
  group_invite_code: string;
  group_status: string;
  created_at: Date;
};

export type UserGroupType = {
  user_id: string;
  group_id: string;
  is_owner: boolean;
  joined_at: Date;
};

export type GroupWithCounts = {
  group_desc: string;
  group_id: string;
  group_image_url: string;
  group_title: string;
  updated_at: Date;
  user_count: number;
};
