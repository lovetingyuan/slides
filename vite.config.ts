import { defineConfig } from 'vite'
import type { Plugin, ResolvedConfig } from 'vite'
import marked from 'marked'
import { readFileSync } from 'fs'
import { dirname, resolve } from 'path'

import { toAttrs } from './src/renderMD'

const mdPlugin: () => Plugin = () => {
  function toSection(content: string, top?: boolean) {
    let first = true;
    const reg = new RegExp(`\\s<${!top ? '<' : ''}-{3,}(.*?)(\\r\\n|\\n)`, 'g');
    if (!reg.test(content)) return content
    return content.replace(reg, (s, t) => {
      if (first) {
        first = false;
        return `\n\n<section ${toAttrs(t)}>\n\n`
      }
      return `\n\n</section>\n\n<section ${toAttrs(t)}>\n\n`
    }) + '\n\n</section>\n\n'
  }
  function importMd(content: string, base: string) {
    const deps: string[] = []
    const code = content.replace(/<include +src="(.+?\.md)">(\r\n|\n)/g, (s, t) => {
      const file = resolve(base, t.trim())
      deps.push(t.trim())
      return '\n' + readFileSync(file, 'utf-8') + '\n'
    })
    return { code, deps }
  }
  let config: ResolvedConfig;
  return {
    name: 'md-plugin',
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
    load(id) {
      if (!id.endsWith('.md')) return
      let md = readFileSync(id, 'utf-8')
      const { code, deps } = importMd(md, dirname(id))
      md = toSection('\n' + code, true)
      const markdown = md.replace(/<section[^>]*>([\s\S]*?)<\/section>/g, (s, t) => {
        return s.replace(t, toSection(t))
      })
      let result = `export default ${JSON.stringify(marked(markdown))};`
      if (config.command === 'build') return result
      return result + `
        ${deps.map((d) => { return `import ${JSON.stringify(d + '?raw')};` }).join('\n')}
        if (import.meta.hot) {
          import.meta.hot.accept((m) => {
            window.__markdown__ = m.default
          })
        }
      `
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  base: '/slides/',
  build: {
    outDir: 'docs'
  },
  plugins: [mdPlugin()]
})
