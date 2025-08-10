import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    // Allow reverse-proxy hostnames in dev if needed
    allowedHosts: [
      'automaclinic-landing.owelyh.easypanel.host',
      'www.multicrypto.com.br',
      'multicrypto.com.br'
    ]
  },
  preview: {
    open: false,
    // Allow reverse-proxy hostnames in preview (production preview)
    allowedHosts: [
      'automaclinic-landing.owelyh.easypanel.host',
      'www.multicrypto.com.br',
      'multicrypto.com.br'
    ]
  }
})
