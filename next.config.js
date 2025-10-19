/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    // This allows the Next.js dev server to accept requests from any origin.
    // This is required for the development environment to work correctly.
    allowedNextBundlerReactRoots: ['.'],
  }
};

module.exports = nextConfig;
