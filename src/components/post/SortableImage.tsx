import { ImagesAllWithoutPostId } from '@/types/projectType';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableImageProps {
  image: ImagesAllWithoutPostId;
  onSetCover: (id: number) => void;
  selectedCover: number | null;
}

const SortableImage = ({ image, onSetCover, selectedCover }: SortableImageProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: image.id! });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: selectedCover === image.id ? '2px solid #4CAF50' : '2px solid transparent', // 대표 이미지에 테두리 색상 적용
    boxShadow: selectedCover === image.id ? '0 4px 8px rgba(76, 175, 80, 0.6)' : 'none', // 대표 이미지에 그림자 추가
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className='keen-slider__slide min-w-[240px] max-w-[240px] h-[240px] cursor-pointer flex flex-col items-center relative'
      onClick={() => image.id && onSetCover(image.id)}
    >
      <div className='absolute bottom-2 right-2 z-10'>
        {selectedCover === image.id ? (
          <span className='bg-primary-400 rounded-xl text-xs text-white px-2 py-1'>대표</span>
        ) : (
          <span
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            className='rounded-xl text-xs text-white px-2 py-1'
          >
            대표
          </span>
        )}
      </div>
      <div className='h-full w-full'>
        <img
          src={image.blobUrl}
          alt='업로드 이미지'
          className='w-full h-full object-cover'
        />
      </div>
    </div>
  );
};

export default SortableImage;
