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
  // This allows the Next.js dev server to accept requests from any origin.
  // This is required for the development environment to work correctly.
  experimental: {
    // Empty as allowedNextBundlerReactRoots has been moved.
  },
  webpack: (config, { isServer }) => {
    // Exclude firebase-admin from client-side bundles
    if (!isServer) {
      config.externals.push('firebase-admin');
    }
    return config;
  },
};

module.exports = nextConfig;
