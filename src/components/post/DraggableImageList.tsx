import SortableImage from './SortableImage';
import { BUCKET_NAME } from '@/constants/constants';
import { useFetchImageUrls } from '@/hooks/queries/byUse/useImageFetchUrlsQuery';
import { useSetCoverLogic } from '@/hooks/queries/byUse/useImageHandlersHooks';
import { useImageUploadStore } from '@/stores/useImageUploadStore';
import { usePostDataStore } from '@/stores/usePostDataStore';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';

// interface imageUrlProps {
//   imageUrls: string[];
//   { imageUrls }: imageUrlProps
// }

const DraggableImageList = () => {
  const { userId = '', groupId = '', uploadSessionId = '' } = usePostDataStore();
  const { images, setImages, setSelectedCover, selectedCover } = useImageUploadStore();
  const { handleSetCover } = useSetCoverLogic(userId, uploadSessionId);
  const { data: imageUrls = [] } = useFetchImageUrls(uploadSessionId, images, BUCKET_NAME, groupId);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);
      const sortedImages = arrayMove(images, oldIndex, newIndex);
      setImages(sortedImages);

      const firstImageId = sortedImages[0]?.id;
      if (firstImageId) {
        await handleSetCover(firstImageId);
        setSelectedCover(firstImageId);
        console.log('첫 번째 이미지를 대표 이미지로 설정했습니다:', firstImageId);
      }
    }
  };

  return (
    <div className='border bg-red-500'>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={images.map((image) => image.id).filter((id): id is number => id !== undefined)}
          strategy={verticalListSortingStrategy}
        >
          <div className='flex gap-4 overflow-x-auto overflow-y-hidden'>
            {
              images.length > 0
                ? images.map(
                    (image, index) =>
                      image.id !== undefined && (
                        <SortableImage
                          key={image.id}
                          image={{
                            ...image,
                            blobUrl: imageUrls[index],
                            post_image_name: image.post_image_name!,
                          }}
                          onSetCover={() => {
                            setSelectedCover(image.id);
                          }}
                          selectedCover={selectedCover}
                        />
                      ),
                  )
                : null
              // <div className='w-[200px] h-[200px] flex items-center justify-center border border-gray-300 text-gray-400'>
              //   이미지를 추가하세요
              // </div>
            }
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default DraggableImageList;
