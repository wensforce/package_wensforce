/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/airport-transfer-bom-mb",
        destination: "/airport-transfer/mumbai",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
