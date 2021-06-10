import Reveal from 'reveal.js'
import Prism from 'prismjs'

import { renderMd } from './renderMD'

const baseOptions = {
  slideNumber: 'c/t',
  fragmentInURL: true,
  history: true,
  previewLinks: true,
  transition: 'concave',
  margin: .2,
  backgroundTransition: 'slide',
  pdfSeparateFragments: false,
}

function start(md: string, hot = false) {
  renderMd(md)
  Prism.highlightAll()
  const config = {
    ...baseOptions,
    ...(window as any).revealOptions
  }
  if (hot) {
    Reveal.configure(config)
    Reveal.toggleOverview();
    Reveal.toggleOverview(); // just refresh all slides
  } else {
    Reveal.initialize(config)
  }
}

if (import.meta.hot) {
  (window as any).__markdown__ || Object.defineProperty(window, '__markdown__', {
    set(md: string) { start(md, true) }
  })
}

const mds = import.meta.glob('../slides/*/index.md')
const mdMap: Record<string, () => Promise<{[k: string]: string}>> = {}
const baseurl = import.meta.env.BASE_URL
Object.keys(mds).forEach(path => {
  const name = path.split('/')[2]
  mdMap[baseurl + name] = mds[path]
})

let redirect = decodeURIComponent(new URLSearchParams(location.search).get('redirect') || '')
if (redirect) {
  if (redirect.endsWith('/')) {
    redirect = redirect.slice(0, -1)
  }
  if (mdMap[redirect]) {
    history.replaceState({}, 'slides', redirect)
    mdMap[redirect]().then(res => {
      start(res.default)
    })
  } else {
    location.href = baseurl
  }
} else {
  if (mdMap[location.pathname]) {
    mdMap[location.pathname]().then(res => {
      start(res.default)
    })
  } else {
    renderMd(mdMap)
  }
}
