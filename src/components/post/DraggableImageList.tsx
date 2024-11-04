import SortableImage from './SortableImage';
import { useImageUploadStore } from '@/stores/useImageUploadStore';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface DraggableImageListProps {
  imageUrls: string[];
  onDragEnd: (event: DragEndEvent) => void;
  onSetCover: (id: number) => void;
  selectedCover: number | null;
}

const DraggableImageList = ({ imageUrls, onDragEnd, onSetCover, selectedCover }: DraggableImageListProps) => {
  const { images } = useImageUploadStore();

  return (
    <div className='w-full m-auto'>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={images.map((image) => image.id).filter((id): id is number => id !== undefined)}
          strategy={verticalListSortingStrategy}
        >
          <div className='flex gap-4 overflow-x-auto overflow-y-hidden'>
            {images.length > 0 ? (
              images.map(
                (image, index) =>
                  image.id !== undefined && (
                    <SortableImage
                      key={image.id}
                      image={{
                        ...image,
                        blobUrl: imageUrls[index],
                        post_image_name: image.post_image_name!,
                        id: image.id,
                      }}
                      onSetCover={() => onSetCover(image.id)}
                      selectedCover={selectedCover}
                    />
                  ),
              )
            ) : (
              <div className='w-[200px] h-[200px] flex items-center justify-center border border-gray-300 text-gray-400'>
                이미지를 추가하세요
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default DraggableImageList;

// import SortableImage from './SortableImage';
// import { useSetCoverImage } from '@/hooks/queries/byUse/usePostImageCoverMutation';
// import { updateCoverImage } from '@/services/client-action/postImageActions';
// import { useImageUploadStore } from '@/stores/useImageUploadStore';
// import { usePostDataStore } from '@/stores/usePostDataStore';
// import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
// import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
// import { useState, useEffect } from 'react';

// interface DraggableImageListProps {
//   imageUrls: string[];
// }

// const DraggableImageList = ({ imageUrls }: DraggableImageListProps) => {
//   const { images, setImages, updateImage } = useImageUploadStore();
//   const { userId, uploadSessionId } = usePostDataStore();
//   const [selectedCover, setSelectedCover] = useState<number | null>(null);

//   const setCoverMutation = useSetCoverImage(userId!, uploadSessionId!);

//   useEffect(() => {
//     // 초기 커버 이미지 설정을 위해 이미지 배열에서 is_cover가 true인 이미지를 찾음
//     const initialCover = images.find((image) => image.is_cover);
//     if (initialCover) {
//       setSelectedCover(initialCover.id);
//     }
//   }, [images]);

//   const handleSetCover = (id: number) => {
//     setCoverMutation.mutate(id, {
//       onSuccess: () => {
//         images.forEach((image) => {
//           updateImage(image.id, { is_cover: image.id === id });
//         });
//         setSelectedCover(id);
//         alert('대표 이미지가 설정되었습니다.');
//       },
//       onError: (error) => {
//         console.error('대표 이미지 설정 오류:', error);
//       },
//     });
//   };

//   const handleDragEnd = async (event: DragEndEvent) => {
//     const { active, over } = event;

//     if (over && active.id !== over.id) {
//       const oldIndex = images.findIndex((img) => img.id === active.id);
//       const newIndex = images.findIndex((img) => img.id === over.id);
//       const sortedImages = arrayMove(images, oldIndex, newIndex);
//       setImages(sortedImages);

//       const firstImageId = sortedImages[0]?.id;
//       if (firstImageId) {
//         try {
//           await updateCoverImage(firstImageId, userId!, uploadSessionId!);
//           setSelectedCover(firstImageId);
//           console.log('첫 번째 이미지를 대표 이미지로 설정했습니다:', firstImageId);
//         } catch (error) {
//           console.error('대표 이미지 설정 오류:', error);
//         }
//       }
//     }
//   };

//   return (
//     <div className='w-full m-auto'>
//       <DndContext
//         collisionDetection={closestCenter}
//         onDragEnd={handleDragEnd}
//       >
//         <SortableContext
//           items={images.map((image) => image.id).filter((id): id is number => id !== undefined)}
//           strategy={verticalListSortingStrategy}
//         >
//           <div className='flex gap-4 overflow-x-auto overflow-y-hidden'>
//             {images.length > 0 ? (
//               images.map(
//                 (image, index) =>
//                   image.id !== undefined && (
//                     <SortableImage
//                       key={image.id}
//                       image={{
//                         ...image,
//                         blobUrl: imageUrls[index],
//                       }}
//                       onSetCover={() => handleSetCover(image.id)}
//                       selectedCover={selectedCover}
//                     />
//                   ),
//               )
//             ) : (
//               <div className='w-[200px] h-[200px] flex items-center justify-center border border-gray-300 text-gray-400'>
//                 이미지를 추가하세요
//               </div>
//             )}
//           </div>
//         </SortableContext>
//       </DndContext>
//     </div>
//   );
// };

// export default DraggableImageList;
