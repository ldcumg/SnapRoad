import SortableImage from './SortableImage';
import { useSetCoverImage } from '@/hooks/queries/byUse/usePostImageCoverMutation';
import { useDeleteImage } from '@/hooks/queries/byUse/usePostImageDeleteMutation';
import { useUploadImage } from '@/hooks/queries/byUse/usePostImageUploadMutation';
import { updateCoverImage } from '@/services/client-action/postImageActions';
import { fetchSignedUrl } from '@/services/client-action/postImageActions';
import { useImageUploadStore } from '@/stores/useImageUploadStore';
import { usePostDataStore } from '@/stores/usePostDataStore';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';

interface ImageListProps {
  uploadSessionId: string;
}

const PostImage = ({ uploadSessionId }: ImageListProps) => {
  const { userId, groupId } = usePostDataStore();
  if (!groupId || !userId) return <div>로딩 중...</div>;

  const { images, addImages, deleteImage, setImages, updateImage, resetImages } = useImageUploadStore();
  const [selectedCover, setSelectedCover] = useState<number | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const bucketName = 'tour_images';
  const folderName = groupId;

  const uploadMutation = useUploadImage(bucketName, folderName, userId, groupId);
  const deleteMutation = useDeleteImage(bucketName, folderName);
  const setCoverMutation = useSetCoverImage(userId, uploadSessionId);

  const fetchImageUrls = async () => {
    const urls = await Promise.all(
      images.map(async (image) => {
        try {
          const url = await fetchSignedUrl(bucketName, folderName, image.post_image_name!);
          return url;
        } catch (error) {
          console.error(`이미지의 URL을 가져오는 중 오류 발생 ${image.id}:`, error);
          return '';
        }
      }),
    );
    setImageUrls(urls);
  };

  useEffect(() => {
    // 그룹이 변경되거나 이미지 목록이 변경될 때 URL 초기화 및 로드
    setImageUrls([]);
    fetchImageUrls();
  }, [images, groupId]);

  useEffect(() => {
    // 컴포넌트 언마운트 시 이미지와 URL 초기화
    return () => {
      resetImages();
      setImageUrls([]);
      console.log('이미지와 URL 초기화됨');
    };
  }, []);

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    if (fileArray.length + images.length > 10) {
      alert('최대 10장의 이미지만 업로드할 수 있습니다.');
      return;
    }

    uploadMutation.mutate(fileArray, {
      onSuccess: (uploadedImages) => {
        addImages(uploadedImages);
        fetchImageUrls();
        if (uploadedImages.length > 0) {
          handleSetCover(uploadedImages[0].id);
        }
      },
    });
  };

  const handleSetCover = (id: number) => {
    setCoverMutation.mutate(id, {
      onSuccess: () => {
        images.forEach((image) => {
          updateImage(image.id, { is_cover: image.id === id });
        });
        setSelectedCover(id);
        fetchImageUrls();
        alert('대표 이미지가 설정되었습니다.');
      },
      onError: (error) => {
        console.error('대표 이미지 설정 오류:', error);
      },
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    // 드래그된 요소와 놓을 위치의 요소가 다를 때만 순서 변경
    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);
      const sortedImages = arrayMove(images, oldIndex, newIndex);
      setImages(sortedImages);

      const firstImageId = sortedImages[0]?.id;
      if (firstImageId) {
        try {
          await updateCoverImage(firstImageId, userId, uploadSessionId);
          setSelectedCover(firstImageId);
          console.log('첫 번째 이미지를 대표 이미지로 설정했습니다:', firstImageId);
        } catch (error) {
          console.error('대표 이미지 설정 오류:', error);
        }
      }
    }
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        deleteImage(id);
        fetchImageUrls();
        alert('이미지가 삭제되었습니다.');
      },
    });
  };

  return (
    <article className='flex flex-col items-center gap-4 p-4'>
      <div className='text-center text-gray-600 mb-2'>
        <span className='text-sm'>이미지 업로드: {images.length} / 10</span>
      </div>

      <div className='w-full m-auto overflow-x-auto'>
        <h2 className='text-center text-sm text-gray-500 mb-2'>대표 이미지 선택</h2>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={images.map((image) => image.id).filter((id): id is number => id !== undefined)}
            strategy={verticalListSortingStrategy}
          >
            <div className='flex gap-4'>
              {images.map((image, index) =>
                image.id !== undefined ? (
                  <SortableImage
                    key={image.id}
                    image={{
                      ...image,
                      blobUrl: imageUrls[index],
                      post_image_name: image.post_image_name!,
                      id: image.id,
                    }}
                    onSetCover={() => handleSetCover(image.id)}
                    selectedCover={selectedCover}
                  />
                ) : null,
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <div className='flex flex-wrap gap-4 mt-4'>
        {images.map((image, index) =>
          image.id !== undefined ? (
            <div
              key={image.id}
              className='relative w-24 h-24 border overflow-hidden'
            >
              <img
                src={imageUrls[index]}
                alt='미리보기 이미지'
                className='w-full h-full object-cover'
              />
              <button
                onClick={() => handleDelete(image.id)}
                className='absolute top-1 right-1 bg-red-500 text-white text-xs p-1 rounded-full'
              >
                ×
              </button>
            </div>
          ) : null,
        )}
        {images.length < 10 && (
          <label className='flex items-center justify-center w-24 h-24 border cursor-pointer'>
            <input
              type='file'
              accept='image/*'
              multiple
              className='hidden'
              onChange={(e) => handleImageUpload(e.target.files)}
            />
            <span className='text-2xl font-bold text-gray-400'>+</span>
          </label>
        )}
      </div>
    </article>
  );
};

export default PostImage;
