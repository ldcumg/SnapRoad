export type PostMarkerImage = {
  is_cover: boolean;
  post_image_name: string;
  post_image_url: string;
  post_lat: string;
  post_lng: string;
};

export type GroupPost = {
  post_id: string;
  images: Array<PostMarkerImage>;
};

export type PostImage = {
  id: number;
  post_id: string;
  post_image_name: string;
  post_image_url: string;
};
