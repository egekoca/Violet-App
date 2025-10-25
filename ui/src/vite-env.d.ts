/// <reference types="vite/client" />

interface ViteTypeOptions {
  // By adding this line, you can make the type of ImportMetaEnv strict
  // to disallow unknown keys.
  // strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_ENOKI_PUBLIC_KEY: string
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_FACEBOOK_CLIENT_ID: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}