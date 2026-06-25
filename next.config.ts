import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'slcgluybjdxsxqyuyjog.supabase.co',
      },
    ],
  },
};

export default nextConfig;