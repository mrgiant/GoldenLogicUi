import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.js'),
      name: 'GoldenLogicUi',
      // ES only: preserveModules (below) emits one file per source module,
      // which a UMD/CJS bundle can't represent. This is what makes the
      // library tree-shakeable — consumers only ship the components they
      // import instead of the whole bundle (incl. TinyMCE, CodeMirror).
      formats: ['es'],
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library.
      // `xlsx` is kept external so the dynamic import() in the DataTable
      // components stays a real dynamic import in the published bundle,
      // letting the consuming app code-split it into a lazily-loaded chunk.
      // TinyMCE is kept external for the same reason — but more critically,
      // running its plugin/theme/model files through this lib build's
      // preserveModules + CommonJS interop wraps each registration in a lazy
      // initializer that never executes on a bare side-effect import, so
      // nothing registers and TinyMCE falls back to 404-ing on theme.js /
      // model.js / plugin.js at runtime. Externalizing lets the consuming
      // app bundle TinyMCE normally, where the self-host imports work.
      external: ['vue', 'xlsx', /^tinymce(\/|$)/],
      output: {
        // One chunk per source file (mirrors src/ layout under dist/),
        // so deep imports like `golden-logic-ui/components/.../GlButton.vue`
        // pull only that component and its own dependencies.
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        // Keep the bundled stylesheet name stable for consumers.
        assetFileNames: 'golden-logic-ui.[ext]',
        globals: {
          vue: 'Vue',
          xlsx: 'XLSX',
        },
      },
    },
  },
});
