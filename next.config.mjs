/** @type {import('next').NextConfig} */
import "./src/lib/env/index.mjs";

const nextConfig = {
    reactStrictMode: true,

    eslint: {
        dirs: ["src"],
    },
};

export default nextConfig;
