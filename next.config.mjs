/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev', '3000-firebase-pers-comp-1757473137291.cluster-fbfjltn375c6wqxlhoehbz44sk.cloudworkstations.dev', '3002-firebase-pers-comp-1757473137291.cluster-fbfjltn375c6wqxlhoehbz44sk.cloudworkstations.dev'],
}

export default nextConfig
