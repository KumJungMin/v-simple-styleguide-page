import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        types: resolve(__dirname, 'src/type/component-docs.ts'),
        core: resolve(__dirname, 'src/core/index.ts')
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        const ext = format === 'es' ? 'esm' : 'cjs'
        return `${entryName}.${ext}.js`
      }
    },
    rollupOptions: {
      external: ['vue', 'markdown-it', 'highlight.js'],
      output: {
        globals: {
          vue: 'Vue',
          'markdown-it': 'MarkdownIt',
          'highlight.js': 'hljs',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
}) 