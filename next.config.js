/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
    // Updated configuration according to Next.js 15 requirements
  },
  serverExternalPackages: [],
  async rewrites() {
    return [
      // Add rewrites if needed
    ];
  },
};

// Always use port 4321 regardless of environment
  process.env.PORT = "4321";
// Force this port by specifying it directly
process.env.NEXT_PUBLIC_PORT = "4321";

module.exports = nextConfig; 