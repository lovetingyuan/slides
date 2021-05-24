import md from './index.md?raw'
import marked from 'marked'

function renderMD(md, container) {
  const gattrs = ['title', 'style', 'class', 'id']
  const markdown = md.replace(/<-{3,}.*/g, s => `\n${s}\n`)
    .replace(/-{3,}>/g, s => `\n${s}\n`)
    .replace(/-{3,}\]/g, s => `\n${s}\n`)
    .replace(/\[-{3,}/g, s => `\n${s}\n`)

  const html = marked(markdown).replace(/<p> *&lt;-{3,}([^<]*)<\/p>/g, (s, t) => {
    const attrs = t.split(',').map(v => {
      if (!v) return ''
      const [k, _v] = v.trim().split('=').map(a => a.trim())
      if (gattrs.includes(k) || k.startsWith('data-')) {
        return `${k}=${JSON.stringify(_v)}`
      }
      return `data-${k}=${JSON.stringify(_v)}`
    }).join(' ')
    return `<section ${attrs}>`
  })
    .replace(/<p> *-{3,}&gt;<\/p>/g, '</section>')
    .replace(/<p> *\[-{3,}<\/p>/g, '<div class="fragment">')
    .replace(/<p> *-{3,}\]<\/p>/g, '</div>')

  if (typeof container === 'string') {
    container = document.querySelector(container)
  }
  container.innerHTML = html
  const processText = children => {
    children && children.length && [...children].forEach(child => {
      if (child.nodeType !== 1) return
      if (/^\[.+\]$/.test(child.innerHTML)) {
        child.innerHTML = child.innerHTML.slice(1, -1)
        child.classList.add('fragment')
      }
      processText(child.children)
    })
  }
  processText(container.children)
  container.querySelectorAll('a').forEach(a => {
    if (!a.target) a.target = '_blank'
  })
}

renderMD(md, '.slides')

document.title = 'vite介绍'
