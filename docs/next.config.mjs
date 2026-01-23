/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/capnp-java',
  assetPrefix: '/capnp-java/',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

export default nextConfig
