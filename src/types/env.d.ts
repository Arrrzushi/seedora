/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_WALLET_CONNECT_PROJECT_ID: string
  readonly VITE_FILCDN_API_KEY: string
  readonly VITE_FILCDN_API_SECRET: string
  readonly VITE_FILCDN_ACCESS_TOKEN: string
  readonly VITE_PINATA_API_KEY: string
  readonly VITE_PINATA_SECRET_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 