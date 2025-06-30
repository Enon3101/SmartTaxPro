import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  // root: 'client', // Rely on root being set in server/vite.ts
  plugins: [
    react({
      // Enable React Fast Refresh
      fastRefresh: true,
    }),
  ],
  build: {
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    
    // Enable CSS code splitting
    cssCodeSplit: true,
    
    // Enhanced minification options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.warn'],
        passes: 2,
      },
      mangle: {
        safari10: true,
      },
      format: {
        comments: false,
      },
    },
    
    // Updated target for better browser support
    target: 'es2020',
    
    rollupOptions: {
      output: {
        // Enhanced manual chunking strategy
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('@radix-ui')) {
              return 'ui-vendor';
            }
            if (id.includes('framer-motion')) {
              return 'animation-vendor';
            }
            if (id.includes('recharts') || id.includes('chart')) {
              return 'chart-vendor';
            }
            if (id.includes('@tanstack/react-query')) {
              return 'query-vendor';
            }
            return 'vendor';
          }
          
          // Feature-based chunking
          if (id.includes('pages/calculators/')) {
            return 'calculators';
          }
          if (id.includes('components/ui/')) {
            return 'ui-components';
          }
          if (id.includes('pages/')) {
            return 'pages';
          }
          if (id.includes('context/')) {
            return 'context';
          }
          if (id.includes('hooks/')) {
            return 'hooks';
          }
        },
        
        // Optimize chunk file names
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId 
            ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '').replace('.ts', '') 
            : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        },
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name?.split('.').pop();
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType ?? '')) {
            return `img/[name]-[hash][extname]`;
          }
          if (/css/i.test(extType ?? '')) {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        entryFileNames: 'js/[name]-[hash].js',
      },
    },
  },
  
  // Enhanced dependency optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@radix-ui/react-accordion',
      '@radix-ui/react-dialog',
      'framer-motion',
      'lucide-react',
      'wouter',
      '@tanstack/react-query',
    ],
    exclude: ['@vite/client', '@vite/env'],
  },
  
  // Performance optimizations
  server: {
    // Enable HMR with optimized settings
    hmr: {
      overlay: true,
    },
    // Optimize file watching
    watch: {
      ignored: ['**/node_modules/**', '**/dist/**'],
    },
  },
  
  resolve: {
    alias: {
      '@': resolve(__dirname, './client/src'),
      '@shared': resolve(__dirname, './shared'),
    },
  },
  
  // CSS optimization
  css: {
    devSourcemap: true,
  },
});
