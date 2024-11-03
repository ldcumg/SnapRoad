import exifr from 'exifr';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const files = formData.getAll('photos') as File[];
  if (files.length === 0) return NextResponse.json({ error: '파일이 없습니다' }, { status: 400 });
  console.log(files);
  const results = [];

  for (const file of files) {
    if (file instanceof File) {
      try {
        const exifData = await exifr.parse(await file.arrayBuffer());
        const thumbnailBuffer = await exifr.thumbnail(await file.arrayBuffer());

        const thumbnailBase64 = thumbnailBuffer
          ? `data:image/jpg;base64,${Buffer.from(thumbnailBuffer).toString('base64')}`
          : null;

        console.log('EXIF 데이터:', exifData, '썸네일 버퍼:', thumbnailBuffer, 'base64로 인코딩:', thumbnailBase64);
        const { latitude, longitude, DateTimeOriginal: dateTaken } = exifData || {};

        results.push({
          name: file.name,
          latitude: latitude || null,
          longitude: longitude || null,
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
