/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_PROVIDER?: string;
  readonly VITE_OPENAI_API_KEY?: string;
  readonly VITE_ANTHROPIC_API_KEY?: string;
  readonly VITE_OLLAMA_ENDPOINT?: string;
  readonly VITE_OLLAMA_MODEL?: string;
  readonly VITE_OPENAI_MODEL?: string;
  readonly VITE_ANTHROPIC_MODEL?: string;
  readonly VITE_CUSTOM_API_KEY?: string;
  readonly VITE_CUSTOM_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

