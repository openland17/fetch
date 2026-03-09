/** @type {import('next').NextConfig} */
const nextConfig = {
  // No server-side features required — app is client-side with mock data
  images: {
    unoptimized: true, // External images (e.g. placedog.net) — no optimization
  },
};

module.exports = nextConfig;
