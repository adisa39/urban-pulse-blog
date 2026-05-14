/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: '*.cloudinary.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
  // Enable gzip/Brotli compression in production
  compress: true,
  // Strict mode for better debugging
  reactStrictMode: true,
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
  // Redirect /admin/edit/[id] → /admin/posts/[id]
  async redirects() {
    return [
      { source: '/admin/edit/:id', destination: '/admin/posts/:id', permanent: true },
    ];
  },
};

module.exports = nextConfig;
