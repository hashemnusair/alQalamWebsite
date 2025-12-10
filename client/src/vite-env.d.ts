/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CAR_IMAGES_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
