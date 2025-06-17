/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  compiler: {
    styledComponents: true,
  },

  devIndicators: {
    position: 'bottom-right',
  },

  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },

  poweredByHeader: false,
}

export default nextConfig;
