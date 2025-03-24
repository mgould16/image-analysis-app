/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "res.cloudinary.com", 
      "cloudinary-res.cloudinary.com" // ✅ Allow Cloudinary resources
    ],
  },
};

export default nextConfig; // ✅ Use `export default` for .mjs (ES Module)
