/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",
  // assetPrefix: "./",
  // basePath: "/ressources/test_next/out",
  webpack: (config, {}) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: {
        loader: "raw-loader",
      },
    });

    return config;
  },
};
export default nextConfig;
