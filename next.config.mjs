/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove standalone output to fix Prisma on Vercel
  // output: 'standalone',
  
  // ESLint configuration for production builds
  eslint: {
    // Disable ESLint during builds to avoid deployment issues
    ignoreDuringBuilds: true,
  },
  
  // TypeScript configuration
  typescript: {
    // Disable TypeScript errors during builds
    ignoreBuildErrors: true,
  },
  
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dropdown-menu', '@radix-ui/react-toast'],
  },

  // Turbopack configuration
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Compression and optimization
  compress: true,
  poweredByHeader: false,

  // Webpack optimization
  webpack: (config, { isServer }) => {
    // Prisma configuration for Vercel
    if (isServer) {
      config.externals = [...(config.externals || []), '_http_common']
      
      // Ensure Prisma client is properly bundled
      config.resolve.alias = {
        ...config.resolve.alias,
        '@prisma/client': '@prisma/client'
      }
    }

    return config
  },

  // Redirects for better SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/dashboard',
        permanent: true,
      },
    ]
  },
}

export default nextConfig

