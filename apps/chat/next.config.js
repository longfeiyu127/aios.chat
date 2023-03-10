module.exports = {
  reactStrictMode: true,
  // '@douyinfe/semi-illustrations'
  transpilePackages: ['@douyinfe/semi-ui', '@douyinfe/semi-icons'],
  async rewrites() {
    console.log('rewrites')
    return {
      // After checking all Next.js pages (including dynamic routes)
      // and static files we proxy any other requests
      fallback: [
        {
          source: '/:path*',
          // destination: `https://config.aioschat.com/:path*`,
          destination: `https://test.pandateacher.com/:path*`,
          // source: '/biz',
          // destination: `https://test.pandateacher.com/biz`,
        },
      ],
    }
  },
};
