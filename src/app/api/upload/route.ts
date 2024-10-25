/* eslint-disable @typescript-eslint/no-unused-vars */
import exifr from 'exifr';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const files = formData.getAll('photos') as File[]; // 다중 파일

  if (files.length === 0) {
    return NextResponse.json({ error: '파일이 없습니다' }, { status: 400 });
  }
  console.log(files);

  const results = [];

  // for 말고 Promise.all()을 사용하여 비동기 파일 처리를 병렬적으로 처리 할 수 있지 않을까?
  for (const file of files) {
    if (file instanceof File) {
      try {
        // EXIF 데이터 추출
        const exifData = await exifr.parse(await file.arrayBuffer());
        // 내장 썸네일
        const thumbnailBuffer = await exifr.thumbnail(await file.arrayBuffer());
        // 썸네일을 base64로 인코딩하여 클라이언트로 전송
        const thumbnailBase64 = thumbnailBuffer
          ? `data:image/jpg;base64,${Buffer.from(thumbnailBuffer).toString('base64')}`
          : null;

        console.log('EXIF 데이터:', exifData);
        console.log('썸네일 버퍼:', thumbnailBuffer);
        console.log('base64로 인코딩:', thumbnailBase64);

        const { latitude, longitude, DateTimeOriginal: dateTaken } = exifData || {};

        results.push({
          name: file.name,
          latitude: latitude || '위도 없음',
          longitude: longitude || '경도 없음',
          dateTaken: dateTaken || '촬영 날짜 없음',
          thumbnail: thumbnailBase64 || '썸네일 없음',
        });
      } catch (error) {
        return NextResponse.json({ error: 'EXIF 데이터를 추출하는 중 오류 발생.' }, { status: 500 });
      }
    }
  }
  return NextResponse.json(results);
}
