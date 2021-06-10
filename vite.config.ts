import { defineConfig } from 'vite'
import type { Plugin, ResolvedConfig } from 'vite'
import marked from 'marked'
import { readFileSync } from 'fs'

import { toAttrs } from './src/renderMD'

function toSection(content: string, second = false) {
  let first = true;
  content = '\n' + content
  const reg = new RegExp(`\\s<${second ? '<' : ''}-{5,}(.*?)(\\r\\n|\\n)`, 'g');
  if (!reg.test(content)) return content
  const code = content.replace(reg, (s, t) => {
    if (first) {
      first = false;
      return `\n\n<section ${toAttrs(t)}>\n\n`
    }
    return `\n\n</section>\n\n<section ${toAttrs(t)}>\n\n`
  }) + '\n\n</section>\n\n'
  if (!second) {
    return code.replace(/<section[^>]*>([\s\S]*?)<\/section>/g, (s, t) => {
      return s.replace(t, toSection(t, true))
    })
  }
  return code
}

function processTags(content: string) {
  const scripts: string[] = [];
  const includes: string[] = [];
  const includeReg = /(<include +src=".+?\.md">)(?:\r\n|\n)/g
  const includeValReg = /<include +src="(.+?\.md)">/
  let code = content.replace(/<script>([\s\S]+)?<\/script>/g, (s, t) => {
    scripts.push(t)
    return ''
  }).replace(/<title>(.+)?<\/title>/, (s, t) => {
    if (t) {
      scripts.push(`document.title = ${JSON.stringify(t)}`)
    }
    return '';
  }).replace(/<link rel="icon" href="([^"]+)">/, (s, href) => {
    if (href.startsWith('http')) {
      scripts.push(`const iconHref = ${JSON.stringify(href)}`)
    } else {
      scripts.push(`import iconHref from ${JSON.stringify(href)}`)
    }
    scripts.push(`
      const icon = document.querySelector('link[rel="icon"]') || document.createElement('link');
      icon.rel = 'icon';
      icon.href = iconHref;
      document.head.appendChild(icon);
    `)
    return ''
  }).replace(/<meta name="([^"]+)" content="([^"]+)">/g, (s, name, value) => {
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
  const markdown = code.split(includeReg).map(b => {
    if (!b.trim()) return '\n'
    if (includeValReg.test(b)) {
      const val = b.match(includeValReg)
      if (val) {
        const varName = 'include_' + Buffer.from(val[1]).toString('base64').replace(/(\+|=|\/)/g, '')
        scripts.push(`import ${varName} from ${JSON.stringify(val[1].trim())}`)
        includes.push(varName)
        return `\n<${varName}>\n`
      }
      return '\n'
    } else {
      return toSection(b)
    }
  }).join('\n')
  return { markdown, includes, scripts }
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
      if (!/\/|\\index\.md$/.test(id)) {
        const markdown = toSection(source)
        return `export default ${JSON.stringify(marked(markdown))}`
      }
      const { markdown, scripts, includes } = processTags(source)
      scripts.push(
        `export default ${JSON.stringify(marked(markdown))}` +
        includes.map(dep => {
          return `.replace(${JSON.stringify(`<${dep}>`)}, ${dep})`
        }).join('')
      )
      const code = scripts.join(';\n')
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
