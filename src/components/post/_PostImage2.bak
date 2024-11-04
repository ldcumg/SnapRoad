import Skeleton from './Skeleton'
import SortableImage from './SortableImage'
import { useSetCoverImage } from '@/hooks/queries/byUse/usePostImageCoverMutation'
import { useDeleteImage } from '@/hooks/queries/byUse/usePostImageDeleteMutation'
import { useUploadImage } from '@/hooks/queries/byUse/usePostImageUploadMutation'
import { fetchImageUrls } from '@/services/client-action/fetchImageUrlsAction'
import { updateCoverImage } from '@/services/client-action/postImageActions'
import { useImageUploadStore } from '@/stores/useImageUploadStore'
import { usePostDataStore } from '@/stores/usePostDataStore'
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

interface ImageListProps {
  uploadSessionId: string
}

const PostImage = ({ uploadSessionId }: ImageListProps) => {
  const { userId, groupId } = usePostDataStore()
  if (!groupId || !userId) return <div>로딩 중...</div>

  const { images, addImages, deleteImage, setImages, updateImage, resetImages } = useImageUploadStore()
  const [selectedCover, setSelectedCover] = useState<number | null>(null)

  const bucketName = 'tour_images'
  const folderName = groupId

  const uploadMutation = useUploadImage(bucketName, folderName, userId, groupId)
  const deleteMutation = useDeleteImage(bucketName, folderName)
  const setCoverMutation = useSetCoverImage(userId, uploadSessionId)

  const {
    data: imageUrls,
    isLoading,
    error
  } = useQuery({
    queryKey: ['imageUrls', images, bucketName, folderName],
    queryFn: () => fetchImageUrls(images, bucketName, folderName),
    enabled: images.length > 0
  })

  useEffect(() => {
    resetImages()
    console.log('이미지와 URL 초기화됨')

    return () => {
      resetImages()
    }
  }, [groupId])

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)
    if (fileArray.length + images.length > 10) {
      alert('최대 10장의 이미지만 업로드할 수 있습니다.')
      return
    }

    uploadMutation.mutate(fileArray, {
      onSuccess: (uploadedImages) => {
        addImages(uploadedImages)
        if (uploadedImages.length > 0) {
          handleSetCover(uploadedImages[0].id)
        }
      }
    })
  }

  const handleSetCover = (id: number) => {
    setCoverMutation.mutate(id, {
      onSuccess: () => {
        images.forEach((image) => {
          updateImage(image.id, { is_cover: image.id === id })
        })
        setSelectedCover(id)
        alert('대표 이미지가 설정되었습니다.')
      },
      onError: (error) => {
        console.error('대표 이미지 설정 오류:', error)
      }
    })
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id)
      const newIndex = images.findIndex((img) => img.id === over.id)
      const sortedImages = arrayMove(images, oldIndex, newIndex)
      setImages(sortedImages)

      const firstImageId = sortedImages[0]?.id
      if (firstImageId) {
        try {
          await updateCoverImage(firstImageId, userId, uploadSessionId)
          setSelectedCover(firstImageId)
          console.log('첫 번째 이미지를 대표 이미지로 설정했습니다:', firstImageId)
        } catch (error) {
          console.error('대표 이미지 설정 오류:', error)
        }
      }
    }
  }

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        deleteImage(id)
        alert('이미지가 삭제되었습니다.')
      }
    })
  }

  if (isLoading) {
    return (
      <div className="flex gap-4">
        {Array.from({ length: images.length || 5 }).map((_, index) => (
          <Skeleton key={index} width="200px" height="200px" />
        ))}
      </div>
    )
  }
  if (error) return <p>이미지 URL 로드 중 오류 발생</p>

  return (
    <article className="flex flex-col items-center gap-4 p-4">
      <div className="text-center text-gray-600 mb-2">
        <span className="text-sm">이미지 업로드: {images.length} / 10</span>
      </div>

      <div className="w-full m-auto overflow-x-auto">
        {/* <h2 className='text-center text-sm text-gray-500 mb-2'>대표 이미지 선택</h2> */}
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={images.map((image) => image.id).filter((id): id is number => id !== undefined)} strategy={verticalListSortingStrategy}>
            <div className="flex gap-4">
              {images.map((image, index) =>
                image.id !== undefined && imageUrls && imageUrls[index] ? (
                  <SortableImage
                    key={image.id}
                    image={{
                      ...image,
                      blobUrl: imageUrls[index],
                      post_image_name: image.post_image_name!,
                      id: image.id
                    }}
                    onSetCover={() => handleSetCover(image.id)}
                    selectedCover={selectedCover}
                  />
                ) : null
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <div className="flex flex-wrap gap-4 mt-4">
        {images.map((image, index) =>
          image.id !== undefined && imageUrls && imageUrls[index] ? (
            <div key={image.id} className="relative w-24 h-24 border overflow-hidden">
              <img src={imageUrls[index]} alt="미리보기 이미지" className="w-full h-full object-cover" />
              <button onClick={() => handleDelete(image.id)} className="absolute top-1 right-1 bg-red-500 text-white text-xs p-1 rounded-full">
                ×
              </button>
            </div>
          ) : null
        )}
        {images.length < 10 && (
          <label className="flex items-center justify-center w-24 h-24 border cursor-pointer">
            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleImageUpload(e.target.files)} />
            <span className="text-2xl font-bold text-gray-400">+</span>
          </label>
        )}
      </div>
    </article>
  )
}

export default PostImage
