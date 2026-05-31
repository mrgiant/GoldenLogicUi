import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/main.js'),
      name: 'GoldenLogicUi',
      // the proper extensions will be added
      fileName: 'golden-logic-ui',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library.
      // `xlsx` is kept external so the dynamic import() in the DataTable
      // components stays a real dynamic import in the published bundle
      // (a single-entry lib build would otherwise inline it), letting the
      // consuming app code-split it into a lazily-loaded chunk.
      external: ['vue', 'xlsx'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
          xlsx: 'XLSX',
        },
      },
    },
  },
});
