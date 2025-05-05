import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.bostonherald.com',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'static01.nyt.com',
        port: '',
        pathname: '/**',
       },
       {
         protocol: 'https',
         hostname: 'i.guim.co.uk',
         port: '',
         pathname: '/**',
       },
       {
         protocol: 'https',
         hostname: 'ca-times.brightspotcdn.com',
         port: '',
         pathname: '/**',
       },
       {
         protocol: 'https',
         hostname: 'www.news-herald.com',
         port: '',
         pathname: '/**',
       },
    ],
  },
};

export default nextConfig;
