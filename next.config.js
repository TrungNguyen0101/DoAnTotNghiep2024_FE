/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.imgur.com', 'res.cloudinary.com', 'devhome.thuvien.edu.vn']
  },
  reactStrictMode: true,
  swcMinify: true
};

module.exports = nextConfig;
