import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'globltools Media Utilities',
    short_name: 'globltools',
    description: 'Instagram download and media utilities in one fast web app.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#065f46',
    orientation: 'any',
    icons: [
      { src: '/app-icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/app-icon-maskable.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
    ],
  };
}
