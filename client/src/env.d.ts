declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined
    VUE_ROUTER_BASE: string | undefined
    NEO4J_URI: string
    NEO4J_USERNAME: string
    NEO4J_PASSWORD: string
  }
}
