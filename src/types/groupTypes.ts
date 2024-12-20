export type GroupObjType = {
  group_id: string;
  group_title: string;
  group_desc: string;
  group_invite_code: string;
  group_status: string;
  created_at: string;
};

export type UpdateGroupObjType = {
  group_id: string;
  updated_at: string;
  group_title?: string;
  group_desc?: string;
};

export type UserGroupType = {
  user_id: string;
  group_id: string;
  is_owner: boolean;
  joined_at: string;
};

export type GroupWithCounts = {
  group_desc: string;
  group_id: string;
  group_image_url: string;
  group_title: string;
  updated_at: string;
  user_count: number;
};

export type GroupInfo = {
  group_desc: string;
  group_image_url: string;
  group_invite_code: string;
  group_title: string;
  user_group: {
    is_owner: boolean;
    profiles: {
      user_email: string;
      user_image_url: string;
      user_nickname: string;
    };
  }[];
};

export enum GroupDetailMode {
  map = 'map',
  album = 'album',
  member = 'member',
}

export type PostData = {
  created_at: string;
  post_address: string;
  post_thumbnail_image: string;
  post_id: string;
  group_id: string;
};

export type PostDataListType = PostData[] | null;
