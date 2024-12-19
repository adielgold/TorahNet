/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yujzruceqccszdlpgpnb.supabase.co",
      },
    ],
  },
};

export default nextConfig;
