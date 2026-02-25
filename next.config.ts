import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    formats: ['image/webp'],
  },
}

export default withPayload(nextConfig)
