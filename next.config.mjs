/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ ADD THIS
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig