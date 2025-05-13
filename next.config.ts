import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverComponentsExternalPackages: [],
  },
  async rewrites() {
    return [
      // Add rewrites if needed
    ];
  },
};

// Export for dev command to use port 4321
if (process.env.NODE_ENV === "development") {
  process.env.PORT = "4321";
}

export default nextConfig;
