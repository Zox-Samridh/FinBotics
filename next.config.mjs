/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
    ],
  },
  experimental: {
    serverActions: {
      enabled: true, // Correct format for serverActions
    },
    // Removed appDir since it's enabled by default in Next.js 15
  },
};

export default nextConfig;