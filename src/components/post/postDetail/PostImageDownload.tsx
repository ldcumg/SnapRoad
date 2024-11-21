'use client';

import BUCKETS from '@/constants/buckets';
import { Icon_Download } from '@/lib/icon/Icon_Download';
import { PostDetail } from '@/types/postDetailTypes';
import { downloadAllAsZip } from '@/utils/downloadUtils';
import React from 'react';

export type ProfileProps = {
  postDetail: PostDetail;
};

const PostImageDownload = ({ postDetail }: ProfileProps) => {
  const handleDownloadImages = async () => {
    try {
      const images = postDetail.images.map((image) => ({
        filename: image.post_image_name,
      }));
      const zipFilename = `SnapRoad_${postDetail.group.group_title || '그룹_이미지'}.zip`;
      const folder = postDetail.group_id || '';

      await downloadAllAsZip(BUCKETS.tourImages, images, zipFilename, folder);
    } catch (error) {
      console.error('이미지 ZIP 다운로드 중 오류 발생:', error);
    }
  };

  return (
    <div
      onClick={handleDownloadImages}
      className='flex cursor-pointer items-center'
    >
      <Icon_Download />
    </div>
  );
};

export default PostImageDownload;
