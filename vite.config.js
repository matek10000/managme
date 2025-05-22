import { defineConfig } from "vite"

export default defineConfig({
  server: {
    host: true,     // zamiast domyślnego 127.0.0.1 nasłuchuje na 0.0.0.0
    port: 3000,     // jeśli wolisz 3000, albo 5173
    strictPort: true
  }
})
