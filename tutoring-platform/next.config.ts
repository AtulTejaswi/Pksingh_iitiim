import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://pksingh-backend.onrender.com/api/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'https://pksingh-backend.onrender.com/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;
