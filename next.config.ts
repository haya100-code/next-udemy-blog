import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol:'https',
        hostname: 'piosum.photos',
      },
    ],
  }
};

export default nextConfig;
