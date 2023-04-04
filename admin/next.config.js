/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  publicRuntimeConfig: {
    apiUrl: {
      http: process.env.HTTP_API_URL,
      ws: process.env.WS_API_URL,
    }
  }
}

module.exports = nextConfig
