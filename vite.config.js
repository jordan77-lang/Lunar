import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Lunar/', // GitHub Pages repository name
  build: {
    outDir: 'docs',
  },
  server: {
    host: true, // Open to local network
  }
});
