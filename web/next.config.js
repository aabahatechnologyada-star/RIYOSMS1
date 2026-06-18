/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en-US'],
    defaultLocale: 'en-US',
  },
  output: 'standalone',

  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
      {
        source: '/android',
        destination: 'https://dl.riyosms.com',
        permanent: false,
      },
    ]
  },
}



module.exports = nextConfig;
