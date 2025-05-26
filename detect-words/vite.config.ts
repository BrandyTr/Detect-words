import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: 'index.html', // Vite automatically looks in root
        background: 'src/scripts/background.js',
        content: 'src/scripts/content.js',
      },
      output: {
        entryFileNames: '[name].js' // prevent hashed names (optional)
      }
    }
  }
});
