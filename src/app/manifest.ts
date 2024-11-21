import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SnapRoad',
    short_name: 'SnapRoad',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#009E6C',
    description: 'SnapRoad: 여행의 추억을 기록하고 공유하세요.',
    icons: [
      {
        src: '/SnapRoad_icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/SnapRoad_icon_green.png', 
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
