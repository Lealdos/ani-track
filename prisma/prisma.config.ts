
import { defineConfig } from 'prisma/config';


type Env = 'development'  | 'staging' | 'production'

const env = (process.env.NODE_ENV as Env) ?? 'development'

const urlByEnv: Record<Env, string> = {
  development: process.env.DATABASE_URL_LOCAL!,
  staging: process.env.DATABASE_URL_STG!,
  production: process.env.DATABASE_URL_PROD!,
}

export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
      path: 'prisma/migrations',
    },
    datasource: {
      url: urlByEnv[env],
    },
  });