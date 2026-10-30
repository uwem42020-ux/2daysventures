import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pyggfgzeaglpqjplrmyu.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.propertypro.ng",
      },
      {
        protocol: "https",
        hostname: "images.nigeriapropertycentre.com",
      },
      {
        protocol: "https",
        hostname: "images.privateproperty.com.ng",
      },
    ],
  },
};

export default nextConfig;