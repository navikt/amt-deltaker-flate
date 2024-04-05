/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENDPOINT_HANDLER?: string
  readonly VITE_MOCK_SERVICE_RUNNER_PATH?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
