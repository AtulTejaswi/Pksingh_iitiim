import type { NextConfig } from "next";
import { API_BASE_URL, BACKEND_BASE_URL } from "./src/lib/config";

const nextConfig: NextConfig = {
  // Pin the workspace root: this repo has multiple lockfiles (backend at the
  // root, frontend here), and Turbopack otherwise infers the wrong one — which
  // breaks next/font resolution on Render ('Can't resolve
  // @vercel/turbopack-next/internal/font/google/font'). Vercel handles
  // monorepo roots natively, which is why this only failed on Render.
  turbopack: {
    root: __dirname,
  },
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
