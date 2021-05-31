import { defineConfig } from 'vite'
import type { Plugin, ResolvedConfig } from 'vite'
import marked from 'marked'
import { readFileSync } from 'fs'

import { toAttrs } from './src/renderMD'

function toSection(content: string, top?: boolean) {
  let first = true;
  const reg = new RegExp(`\\s<${!top ? '<' : ''}-{5,}(.*?)(\\r\\n|\\n)`, 'g');
  if (!reg.test(content)) return content
  const code = content.replace(reg, (s, t) => {
    if (first) {
      first = false;
      return `\n\n<section ${toAttrs(t)}>\n\n`
    }
    return `\n\n</section>\n\n<section ${toAttrs(t)}>\n\n`
  }) + '\n\n</section>\n\n'
  if (top) {
    return code.replace(/<section[^>]*>([\s\S]*?)<\/section>/g, (s, t) => {
      return s.replace(t, toSection(t))
    })
  }
  return code
}

function processTags(content: string) {
  const scripts: string[] = [];
  const includes: string[] = [];
  const code = content.replace(/<include +src="(.+?\.md)">(\r\n|\n)/g, (s, t) => {
    const varName = 'include$' + Buffer.from(s).toString('base64').replace(/(\+|=|\/)/g, '')
    scripts.push(`import ${varName} from ${JSON.stringify(t.trim())}`)
    includes.push(varName)
    return `\n\n${varName}\n\n` // will compiled to <p>
  }).replace(/<script>([\s\S]+)?<\/script>/g, (s, t) => {
    scripts.push(t)
    return ''
  }).replace(/<title>(.+)?<\/title>/, (s, t) => {
    if (t) {
      scripts.push(`document.title = ${JSON.stringify(t)}`)
    }
    return '';
  }).replace(/<meta name="([^"]+)" content="([^"]+)" *>/g, (s, name, value) => {
    if (name === 'theme') {
      if (!['beige', 'black', 'blood', 'league', 'moon', 'night', 'serif', 'simple', 'sky', 'solarized', 'white'].includes(value)) {
        value = 'simple'
      }
      scripts.push(`import ${JSON.stringify(`reveal.js/dist/theme/${value}.css`)}`)
    } else if (name === 'code-theme') {
      if (!['coy', 'dark', 'funky', 'okaidia', 'solarizedlight', 'tomorrow', 'twilight'].includes(value)) {
        value = 'tomorrow'
      }
      scripts.push(`import ${JSON.stringify(`prismjs/themes/prism-${value}.css`)}`)
    }
    return '';
  })
  return { code, includes, scripts }
}

const MdPlugin: () => Plugin = () => {
  let config: ResolvedConfig;
  return {
    name: 'md-plugin',
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
    async load(id) {
      if (!id.endsWith('.md')) return
      const source = readFileSync(id, 'utf-8')
      if (!id.endsWith('/index.md')) {
        const markdown = toSection('\n' + source, true)
        return `export default ${JSON.stringify(marked(markdown))}`
      }
      const { code: _code, scripts, includes } = processTags(source)
      const markdown = toSection('\n' + _code, true)
      const code = `
        ${scripts.join(';\n')};
        export default ${JSON.stringify(marked(markdown))}${includes.map(dep => {
          return `.replace(${JSON.stringify(`<p>${dep}</p>`)}, ${dep})`
        }).join('')};
      `
      if (config.command === 'build') return code
      return code + `
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
  plugins: [MdPlugin()]
})
