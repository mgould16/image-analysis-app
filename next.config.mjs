// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cloudinary-res.cloudinary.com"], // ✅ Allow Cloudinary images
  },
};

export default nextConfig; // ✅ Use `export default` for .mjs (ES Module)
