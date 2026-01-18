/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // <--- ESTO ES LO MÁS IMPORTANTE
  images: {
    unoptimized: true, // Firebase Hosting no soporta la optimización de imágenes nativa de Next.js
  },
};

export default nextConfig;