/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Disable server-side features since we're exporting a static site
  trailingSlash: true,
};

module.exports = nextConfig;
