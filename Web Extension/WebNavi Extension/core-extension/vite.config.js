import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['playwright-crx']
  },
  build: {
    minify: false,
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        background: path.resolve(__dirname, 'src/background/background.js'),  
        sidepanel: path.resolve(__dirname, 'index.html'),                     // main extension popup
        landing: path.resolve(__dirname, 'landingpage.html'),                 // landing page
      },
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`
      }
    }
  }
});