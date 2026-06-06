/** @type {import('next').NextConfig} */
const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL?.replace(/\/+$/, '') || '';
const nextConfig = {
  reactStrictMode: true,

  assetPrefix: cdnUrl || undefined,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    path: cdnUrl ? `${cdnUrl}/_next/image` : '/_next/image',
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compression settings
  compress: true,

  // Optimization settings
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
};

export default nextConfig;