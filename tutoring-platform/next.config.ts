import type { NextConfig } from "next";
import { API_BASE_URL, BACKEND_BASE_URL } from "./src/lib/config";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_BASE_URL}/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${BACKEND_BASE_URL}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
