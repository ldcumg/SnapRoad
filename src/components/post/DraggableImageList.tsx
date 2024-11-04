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
