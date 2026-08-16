import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  // Points to your custom service worker file
  swSrc: "app/sw.ts",
  // The output file that the browser will load
  swDest: "public/sw.js",
  //explicitly register the service worker in the browser
  register: true,
  // Disable in dev mode to prevent caching confusion while coding
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default withSerwist(nextConfig);