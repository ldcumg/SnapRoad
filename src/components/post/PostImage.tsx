import DraggableImageList from './DraggableImageList';
import ImageUplaodCounter from './ImageUplaodCounter';
import ThumbnailImageList from './ThumbnailImageList';
import { useSetCoverImage } from '@/hooks/queries/byUse/usePostImageCoverMutation';
import { useDeleteImage } from '@/hooks/queries/byUse/usePostImageDeleteMutation';
import { useUploadImage } from '@/hooks/queries/byUse/usePostImageUploadMutation';
import { fetchSignedUrl } from '@/services/client-action/postImageActions';
import { useImageUploadStore } from '@/stores/useImageUploadStore';
import { usePostDataStore } from '@/stores/usePostDataStore';
import browserClient from '@/utils/supabase/client';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useEffect, useState, useRef } from 'react';

interface ImageListProps {
  uploadSessionId: string;
}

const PostImage = ({ uploadSessionId }: ImageListProps) => {
  const { userId, groupId } = usePostDataStore();
  const { images, addImages, deleteImage, setImages, resetImages, updateImage } = useImageUploadStore();
  if (!groupId || !userId) return <div>로딩 중...</div>;

  const [selectedCover, setSelectedCover] = useState<number | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const prevGroupIdRef = useRef<string | null>(null);

  const loadImagesForGroup = async (groupId: string) => {
    try {
      const { data, error } = await browserClient
        .from('images')
        .select('*')
        .eq('user_id', userId)
        .eq('upload_session_id', uploadSessionId);

      if (error) {
        console.error('이미지 로드 오류:', error.message);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('이미지 로드 중 오류 발생:', error);
      return [];
    }
  };

  useEffect(() => {
    if (prevGroupIdRef.current !== groupId) {
      resetImages();
      prevGroupIdRef.current = groupId;
      loadImagesForGroup(groupId);
    }
  }, [groupId, resetImages]);

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
          console.log(`이미지의 URL을 가져왔습니다 ${image.id}:`, url);
          return url;
        } catch (error) {
          console.error(`이미지의 URL을 가져오는 중 오류가 발생했습니다 ${image.id}:`, error);
          return '';
        }
      }),
    );
    setImageUrls(urls);
  };

  useEffect(() => {
    fetchImageUrls();
  }, [images, bucketName, folderName]);

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      if (fileArray.length + images.length > 10) {
        alert('최대 10장의 이미지만 업로드할 수 있습니다.');
        return;
      }

      uploadMutation.mutate(fileArray, {
        onSuccess: (uploadedImages: any[]) => {
          const newImages = uploadedImages.filter(
            (newImage: { id: number }) => !images.some((img) => img.id === newImage.id),
          );
          addImages(newImages);
          fetchImageUrls();
          console.log('업로드된 이미지:', uploadedImages);

          if (newImages.length > 0) {
            handleSetCover(newImages[0].id!);
          }
        },
      });
    }
  };

  const handleSetCover = (id: number) => {
    setCoverMutation.mutate(id, {
      onSuccess: () => {
        setSelectedCover(id);

        const updatedImages = images.map((image) => ({
          ...image,
          is_cover: image.id === id,
        }));

        updatedImages.forEach((image) => {
          updateImage(image.id!, { is_cover: image.is_cover });
        });

        alert('대표 이미지가 설정되었습니다.');
        fetchImageUrls();
      },
      onError: (error) => {
        console.error('대표 이미지 설정 오류:', error);
        alert('대표 이미지 설정에 실패했습니다.');
      },
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);
      const sortedImages = arrayMove(images, oldIndex, newIndex);
      setImages(sortedImages);

      if (sortedImages.length > 0) {
        const firstImageId = sortedImages[0].id;
        if (firstImageId !== undefined) handleSetCover(firstImageId);
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
      onError: (error: any) => {
        console.error('이미지 삭제 오류:', error);
        alert('이미지 삭제에 실패했습니다.');
      },
    });
  };

  return (
    <article className='flex flex-col items-center gap-4 p-4'>
      <ImageUplaodCounter imageCount={images.length} />

      <DraggableImageList
        imageUrls={imageUrls}
        onDragEnd={handleDragEnd}
        onSetCover={(id) => setSelectedCover(id)}
        selectedCover={selectedCover}
      />
      <ThumbnailImageList
        imageUrls={imageUrls}
        handleDelete={handleDelete}
        handleImageUpload={handleImageUpload}
      />
    </article>
  );
};

export default PostImage;

//  return (
//     <article className='flex flex-col items-center gap-4 p-4'>
//       <div className='text-center text-gray-600 mb-2'>
//         <span className='text-sm '>이미지 업로드: {images.length} / 10</span>
//       </div>

//       <div className='w-full m-auto'>
//         <DndContext
//           collisionDetection={closestCenter}
//           onDragEnd={handleDragEnd}
//         >
//           <SortableContext
//             items={images.map((image) => image.id).filter((id): id is number => id !== undefined)}
//             strategy={verticalListSortingStrategy}
//           >
//             <div className='flex gap-4 overflow-x-auto overflow-y-hidden'>
//               {images.map(
//                 (image, index) =>
//                   image.id !== undefined && (
//                     <SortableImage
//                       key={image.id}
//                       image={{
//                         ...image,
//                         blobUrl: imageUrls[index],
//                         post_image_name: image.post_image_name!,
//                         id: image.id,
//                       }}
//                       onSetCover={() => handleSetCover(image.id)}
//                       selectedCover={selectedCover}
//                     />
//                   ),
//               )}
//             </div>
//           </SortableContext>
//         </DndContext>
//       </div>

//       <div className='flex flex-wrap gap-4 mt-4'>
//         {images.map(
//           (image, index) =>
//             image.id !== undefined && (
//               <div
//                 key={image.id}
//                 className='relative w-24 h-24 border overflow-hidden'
//               >
//                 <img
//                   src={imageUrls[index]}
//                   alt='미리보기 이미지'
//                   className='w-full h-full object-cover'
//                 />
//                 <button
//                   onClick={() => handleDelete(image.id)}
//                   className='absolute top-1 right-1 bg-red-500 text-white text-xs p-1 rounded-full'
//                 >
//                   ×
//                 </button>
//               </div>
//             ),
//         )}
//         {images.length < 10 && (
//           <form
//             onSubmit={() => {
//               console.log('hh');
//             }}
//           >
//             <label className='flex items-center justify-center w-24 h-24 border cursor-pointer'>
//               <input
//                 type='file'
//                 accept='image/*'
//                 multiple
//                 className='hidden'
//                 onChange={(e) => handleImageUpload(e.target.files)}
//               />
//               <span className='text-2xl font-bold text-gray-400'>+</span>
//             </label>
//           </form>
//         )}
//       </div>
//     </article>
//   );
