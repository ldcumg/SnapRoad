export interface UploadedImageData {
  id: number;
  // path: string;
  blobUrl: string;
  filename: string;
  latitude?: string;
  longitude?: string;
  dateTaken?: string;
  isCover?: boolean;
  userId?: string;
  createdAt: string;
  uploadSessionId: string;
  postImageName?: string;
}

// 포스트 폼에 필요한 데이터
export interface PostFormImageData {
  id: number;
  postImageName: string;
  postLat: string;
  postLng: string;
  uploadSessionId: string;
  blobUrl: string;
}

// export type ImageData = {
//   path: string; // 경로만 저장
//   filename: string;
// };
