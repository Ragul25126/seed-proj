/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
};

export default nextConfig;
