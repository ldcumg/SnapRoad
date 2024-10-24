import browserClient from '@/utils/supabase/client';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

/**
 * 개별 파일 다운로드
 * @param filename 파일명
 * @param folder 폴더명 (optional)
 */

export const downloadSingleFile = async (filename: string, folder = 'group_name') => {
  try {
    const { data, error } = await browserClient.storage
      .from('tour_images')
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
 * @param images 파일 정보 배열
 * @param zipFilename ZIP 파일명
 * @param folder 폴더명 (optional)
 */

export const downloadAllAsZip = async (images: { filename: string }[], zipFilename: string, folder = 'group_name') => {
  const zip = new JSZip();

  for (const image of images) {
    try {
      const { data, error } = await browserClient.storage
        .from('tour_images')
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
