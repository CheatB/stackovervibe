import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { Users } from '@/collections/Users'
import { Guides } from '@/collections/Guides'
import { Tools } from '@/collections/Tools'
import { Categories } from '@/collections/Categories'
import { Tags } from '@/collections/Tags'
import { Media } from '@/collections/Media'
import { Pages } from '@/collections/Pages'
import { Posts } from '@/collections/Posts'
import { Comments } from '@/collections/Comments'
import { Reactions } from '@/collections/Reactions'
import { SiteSettings } from '@/globals/SiteSettings'
import { Navigation } from '@/globals/Navigation'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' — Stackovervibe CMS',
    },
  },

  collections: [Users, Guides, Tools, Categories, Tags, Media, Pages, Posts, Comments, Reactions],

  globals: [SiteSettings, Navigation],

  editor: lexicalEditor(),

  secret: process.env.PAYLOAD_SECRET || 'CHANGE-ME-IN-ENV',

  typescript: {
    outputFile: path.resolve(dirname, 'src/payload-types.ts'),
  },

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
})
