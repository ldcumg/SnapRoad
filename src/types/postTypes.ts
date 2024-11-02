export type PostImage = {
  id: string;
  post_id: string;
  post_image_name: string;
  post_image_url: string;
};

export type PostCoverImage = PostImage & {
  post_lat: number;
  post_lng: number;
};
