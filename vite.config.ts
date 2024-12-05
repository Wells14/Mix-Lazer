import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
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
      overlay: false
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@radix-ui/react-switch',
      '@radix-ui/react-label',
      '@radix-ui/react-popover',
      '@radix-ui/react-scroll-area',
      'lucide-react',
      'zustand'
    ]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': [
            '@radix-ui/react-switch',
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-tabs',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-progress',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1500,
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false
  }
})
