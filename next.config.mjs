import path from "node:path";

const backendOrigin = process.env.NEXT_PUBLIC_BACKEND_ORIGIN ?? "https://globopersona-a1-backend.vercel.app";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(process.cwd()),
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendOrigin}/api/:path*`
      }
    ];
  }
};

export default nextConfig;