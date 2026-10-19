/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // Removes X-Powered-By header (security best practice)
  images: {
    // Cloudinary does the resizing (see src/lib/cloudinary/image-loader.ts)
    loader: 'custom',
    loaderFile: './src/lib/cloudinary/image-loader.ts',
    qualities: [60, 75],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  experimental: {
    // app/global-not-found.tsx: real 404 for URLs outside /[lang] (e.g. /xx)
    globalNotFound: true,
    optimizePackageImports: [
      '@radix-ui/react-icons',
      'lucide-react',
    ],
  },
};

export default nextConfig;
