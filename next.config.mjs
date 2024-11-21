import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    localPatterns: [
      {
        pathname: '/images/**',
        search: '',
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: `${process.env.NEXT_PUBLIC_SUPABASE}.supabase.co`,
        port: '',
        pathname: '**',
      },
    ],
  },
};
export default withSentryConfig(nextConfig, {
  org: 'yuna-ii',
  project: 'javascript-nextjs',

  silent: !process.env.CI,

  widenClientFileUpload: true,

  reactComponentAnnotation: {
    enabled: true,
  },

  tunnelRoute: '/monitoring',

  hideSourceMaps: true,

  disableLogger: true,

  automaticVercelMonitors: true,
});
