import browserClient from '@/utils/supabase/client';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

/**
 * 개별 파일 다운로드
 * @param bucketName 버킷명
 * @param filename 파일명
 * @param folder 폴더명
 */

export const downloadSingleFile = async (bucketName: string, filename: string, folder: string) => {
  try {
    const { data, error } = await browserClient.storage
      .from(bucketName) // 버킷 이름을 매개변수로 받음
      .createSignedUrl(`${folder}/${filename}`, 60, { download: true });

    if (error || !data) throw new Error('파일 다운로드 실패');

    const link = document.createElement('a');
    link.href = data.signedUrl;
    link.download = filename;
    link.click();
  } catch (err) {
    console.error('이미지 다운로드 오류 발생:', err);
  }
};

/**
 * 모든 파일을 ZIP으로 다운로드
 * @param bucketName 버킷명
 * @param images 파일 정보 배열
 * @param zipFilename ZIP 파일명
 * @param folder 폴더명
 */

export const downloadAllAsZip = async (
  bucketName: string,
  images: { filename: string }[],
  zipFilename: string,
  folder: string,
) => {
  const zip = new JSZip();

  for (const image of images) {
    try {
      const { data, error } = await browserClient.storage
        .from(bucketName) // 버킷 이름을 매개변수로 받음
        .createSignedUrl(`${folder}/${image.filename}`, 60, { download: true });

      if (error || !data) {
        console.error('파일 다운로드 실패:', error);
        continue;
      }

      const response = await fetch(data.signedUrl);
      const blob = await response.blob();
      zip.file(image.filename, blob);
    } catch (err) {
      console.error('파일 추가 중 오류 발생:', err);
    }
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, zipFilename);
};
