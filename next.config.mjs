/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  serverExternalPackages: [
    "ffmpeg-static",
    "ffprobe-static",
    "fluent-ffmpeg",
    "playwright-core",
    "@sparticuz/chromium",
  ],

  outputFileTracingIncludes: {
    'app/api/*': ['node_modules/playwright-core/browsers.json'],
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;