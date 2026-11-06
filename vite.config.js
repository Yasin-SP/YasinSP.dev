import { readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Inline the app's JS and CSS into index.html so the first page needs exactly one
 * request. On networks that reset parallel connections (seen in Iran) the separate
 * script/stylesheet requests were dropped and the page stayed blank; one request
 * can't be half-delivered. Images and fonts stay as normal files and load lazily.
 */
function inlineEntry() {
  let outDir = 'dist'
  return {
    name: 'inline-entry',
    apply: 'build',
    configResolved(config) { outDir = config.build.outDir },
    // Runs after Vite has finished rewriting the bundle (preload helpers etc.), so the
    // code inlined here is exactly what would otherwise have been written to /assets.
    closeBundle() {
      const htmlPath = join(outDir, 'index.html')
      let html = readFileSync(htmlPath, 'utf8')
      html = html.replace(/<script type="module"[^>]*src="(\/assets\/[^"]+\.js)"[^>]*><\/script>/, (_, src) => {
        const file = join(outDir, src)
        const code = readFileSync(file, 'utf8').replace(/<\/script/gi, '<\\/script')
        rmSync(file)
        return `<script type="module">${code}</script>`
      })
      html = html.replace(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/, (_, href) => {
        const file = join(outDir, href)
        const css = readFileSync(file, 'utf8').replace(/<\/style/gi, '<\\/style')
        rmSync(file)
        return `<style>${css}</style>`
      })
      html = html.replace(/<link rel="modulepreload"[^>]*>\s*/g, '')
      writeFileSync(htmlPath, html)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    inlineEntry(),
  ],
  build: {
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
})
