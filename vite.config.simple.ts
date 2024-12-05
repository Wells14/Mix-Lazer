import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    hmr: {
      overlay: false // Desativa a sobreposição de erros
    },
  },
  // Configuração simplificada para carregamento mais rápido
  optimizeDeps: {
    exclude: ['@radix-ui/react-switch']
  }
})
