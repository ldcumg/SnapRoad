'use client';

import SortableImage from './SortableImage';
import { BUCKET_NAME } from '@/constants/constants';
import { useFetchImageUrls } from '@/hooks/queries/post/useImageFetchUrlsQuery';
import { useSetCoverLogic } from '@/hooks/queries/post/useImageHandlersHooks';
import { useImageUploadStore } from '@/stores/post/useImageUploadStore';
import { usePostDataStore } from '@/stores/post/usePostDataStore';
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { useEffect } from 'react';

const DraggableImageList = () => {
  const { userId = '', groupId = '', uploadSessionId = '' } = usePostDataStore();
  const { images, setImages, setSelectedCover, selectedCover } = useImageUploadStore();
  const { handleSetCover } = useSetCoverLogic(userId, uploadSessionId);
  const { data: imageUrls = [] } = useFetchImageUrls(uploadSessionId, images, BUCKET_NAME, groupId);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const [sliderRef] = useKeenSlider({
    loop: false,
    mode: 'free-snap',
    slides: {
      perView: 3,
    },
  });

  // 대표 이미지가 없을 경우에 첫 번째 이미지를 대표 이미지로 설정
  useEffect(() => {
    if (images.length > 0 && selectedCover === null) {
      const firstImageId = images[0].id;
      setSelectedCover(firstImageId);
      handleSetCover(firstImageId);
    }
  }, [images, selectedCover]);

  // 이미지 배열의 첫 번째 이미지가 변경될 때 대표 이미지로 설정
  useEffect(() => {
    if (images.length > 0 && images[0].id !== selectedCover) {
      const firstImageId = images[0].id;
      setSelectedCover(firstImageId);
      handleSetCover(firstImageId);
    }
  }, [images]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);
      const sortedImages = arrayMove(images, oldIndex, newIndex);

      setImages([...sortedImages]);

      // 드래그된 이미지가 첫 번째 이미지로 올 경우 대표 이미지로 설정
      if (sortedImages.length > 0 && sortedImages[0].id !== selectedCover) {
        const newCoverImageId = sortedImages[0].id;
        setSelectedCover(newCoverImageId);
        await handleSetCover(newCoverImageId);
      }
    }
  };

  return (
    <div
      ref={sliderRef}
      className={`keen-slider`}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={images.map((image) => image.id).filter((id): id is number => id !== undefined)}
          strategy={verticalListSortingStrategy}
        >
          <div className='flex gap-4 overflow-x-auto overflow-y-hidden'>
            {images.length > 0
              ? images.map((image, index) =>
                  image.id !== undefined ? (
                    <div
                      key={image.id}
                      className='keen-slider__slide !h-[240px] !min-h-[240px] !min-w-[240px] !max-w-[240px] flex-1'
                    >
                      <SortableImage
                        image={{
                          ...image,
                          blobUrl: imageUrls[index],
                          post_image_name: image.post_image_name!,
                        }}
                        onSetCover={() => {
                          setSelectedCover(image.id);
                          handleSetCover(image.id);
                        }}
                        selectedCover={selectedCover}
                      />
                    </div>
                  ) : null,
                )
              : null}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default DraggableImageList;

// import SortableImage from './SortableImage';
// import { BUCKET_NAME } from '@/constants/constants';
// import { useFetchImageUrls } from '@/hooks/queries/post/useImageFetchUrlsQuery';
// import { useSetCoverLogic } from '@/hooks/queries/post/useImageHandlersHooks';
// import { useImageUploadStore } from '@/stores/post/useImageUploadStore';
// import { usePostDataStore } from '@/stores/post/usePostDataStore';
// import {
//   DndContext,
//   DragEndEvent,
//   closestCenter,
//   TouchSensor,
//   MouseSensor,
//   useSensor,
//   useSensors,
// } from '@dnd-kit/core';
// import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
// import { useEffect } from 'react';

// const DraggableImageList = () => {
//   const { userId = '', groupId = '', uploadSessionId = '' } = usePostDataStore();
//   const { images, setImages, setSelectedCover, selectedCover } = useImageUploadStore();
//   const { handleSetCover } = useSetCoverLogic(userId, uploadSessionId);
//   const { data: imageUrls = [] } = useFetchImageUrls(uploadSessionId, images, BUCKET_NAME, groupId);
//   // console.log('현재 이미지 배열 상태:', images);
//   const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

//   // 대표 이미지가 없을 경우에만 첫 번째 이미지를 대표 이미지로 설정
//   useEffect(() => {
//     if (images.length > 0 && selectedCover === null) {
//       const firstImageId = images[0].id;
//       setSelectedCover(firstImageId);
//       handleSetCover(firstImageId);
//       // console.log('초기 대표 이미지로 설정:', firstImageId);
//     }
//   }, [images, selectedCover]);

//   const handleDragEnd = async (event: DragEndEvent) => {
//     const { active, over } = event;

//     if (over && active.id !== over.id) {
//       const oldIndex = images.findIndex((img) => img.id === active.id);
//       const newIndex = images.findIndex((img) => img.id === over.id);
//       const sortedImages = arrayMove(images, oldIndex, newIndex);

//       // 드래그된 이미지를 맨 앞에 위치시키기 위해 배열 재정렬
//       const draggedImage = sortedImages[0];
//       setImages([...sortedImages]); // 배열을 새로운 배열로 업데이트

//       // 드래그한 이미지가 대표 이미지가 되도록 설정
//       const newCoverImageId = draggedImage.id;
//       if (newCoverImageId) {
//         setSelectedCover(newCoverImageId); // 상태 업데이트
//         await handleSetCover(newCoverImageId); // 비동기 서버 요청
//         // console.log('드래그 후 대표 이미지로 설정:', newCoverImageId);
//       }
//     }
//   };

//   // 이미지 배열 상태 변경 확인
//   useEffect(() => {
//     // console.log('현재 이미지 배열 상태:', images);
//     // console.log(`이미지 ${images} 컴포넌트가 렌더링됨. 현재 selectedCover: ${selectedCover}`);
//   }, [images, selectedCover]);

//   return (
//     <div className={`overflow-x-auto overflow-y-hidden ${images.length > 0 ? 'w-auto' : 'w-full'} `}>
//       <DndContext
//         sensors={sensors}
//         collisionDetection={closestCenter}
//         onDragEnd={handleDragEnd}
//       >
//         <SortableContext
//           items={images.map((image) => image.id).filter((id): id is number => id !== undefined)}
//           strategy={verticalListSortingStrategy}
//         >
//           <div className='flex gap-4 '>
//             {images.length > 0
//               ? images.map((image, index) =>
//                   image.id !== undefined ? (
//                     <SortableImage
//                       key={image.id}
//                       image={{
//                         ...image,
//                         blobUrl: imageUrls[index],
//                         post_image_name: image.post_image_name!,
//                       }}
//                       onSetCover={() => {
//                         setSelectedCover(image.id);
//                         handleSetCover(image.id);
//                         // console.log('대표 이미지로 설정:', image.id);
//                       }}
//                       selectedCover={selectedCover}
//                     />
//                   ) : null,
//                 )
//               : null}
//           </div>
//         </SortableContext>
//       </DndContext>
//     </div>
//   );
// };

// export default DraggableImageList;
