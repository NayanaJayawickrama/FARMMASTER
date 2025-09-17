import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      // Enable fast refresh and prevent crashes
      fastRefresh: true,
      // Add error overlay configuration
      jsxRuntime: 'automatic'
    })
  ],
  server: {
    port: 5173,
    host: 'localhost',
    strictPort: false, // Allow fallback to other ports if 5173 is busy
    hmr: {
      port: 5173,
      host: 'localhost',
      overlay: true, // Show error overlay instead of crashing
      // Improve WebSocket connection stability
      clientPort: 5173
    },
    // Add error handling and improve stability
    middlewareMode: false,
    cors: true,
    // Improve file watching to prevent crashes
    watch: {
      usePolling: process.env.VITE_USE_POLLING === 'true',
      interval: 1000,
      // Ignore large directories and files that can cause issues
      ignored: [
        '**/node_modules/**', 
        '**/.git/**',
        '**/dist/**',
        '**/.vite/**',
        '**/coverage/**',
        '**/*.log'
      ]
    }
  },
  // Optimize dependencies to prevent crashes
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      'lucide-react'
    ],
    exclude: ['vite']
  },
  // Improve error handling during build
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress warnings that can cause instability
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return
        if (warning.code === 'CIRCULAR_DEPENDENCY') return
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return
        warn(warning)
      }
    },
    // Improve source map generation
    sourcemap: true,
    // Reduce chunk size warnings
    chunkSizeWarningLimit: 1000
  },
  // Add better error reporting and prevent crashes
  esbuild: {
    logOverride: { 
      'this-is-undefined-in-esm': 'silent',
      'commonjs-variable-in-esm': 'silent'
    }
  },
  // Define environment variables
  define: {
    global: 'globalThis'
  }
})
