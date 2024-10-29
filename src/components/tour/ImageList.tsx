'use client';

import { useImagesQuery } from '@/hooks/queries/byUse/useImageQuery';

const ImageList = () => {
  const { data, isLoading, error } = useImagesQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Images</h2>
      <ul>
        {data?.map((image) => (
          <li key={image.image_id}>
            <img
              src={image.post_image_url}
              alt={image.post_image_name}
            />
            <p>User ID: {image.user_id}</p>
            <p>Latitude: {image.post_lat}</p>
            <p>Longitude: {image.post_lng}</p>
            <p>Created At: {image.created_at}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ImageList;
