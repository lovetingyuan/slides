import Reveal from 'reveal.js'
import Prism from 'prismjs'

import renderMD from './renderMD'

const mds = import.meta.glob('../slides/*/index.md')
const mdMap: Record<string, () => Promise<{[k: string]: string}>> = {}
const baseurl = import.meta.env.BASE_URL
Object.keys(mds).forEach(path => {
  const name = path.split('/')[2]
  mdMap[baseurl + name] = mds[path]
})
const fetchMd = mdMap[location.pathname]

if (fetchMd) {
  fetchMd().then(res => {
    start(res.default)
  })
} else {
  (document.querySelector('.reveal') as HTMLDivElement).innerHTML = `
    <h3 style="margin: 40px;">slides: </h3>
    <ul style="margin: 40px 100px">
      ${Object.keys(mdMap).map(path => {
        return `<li><a href="${path}">${path}</a></li>`
      }).join('')}
    </ul>
  `
}

let md: string = ''

function start(_md: string) {
  renderMD(_md)
  md = _md

  Reveal.initialize({
    slideNumber: 'c/t',
    fragmentInURL: true,
    history: true,
    transition: 'concave',
    margin: .2,
    backgroundTransition: 'slide',
    // minScale: 0.2,
    // maxScale: 1.0,
    pdfSeparateFragments: false
  })

  Prism.highlightAll()
}

if (import.meta.hot) {
  (window as any).__markdown__ || Object.defineProperty(window, '__markdown__', {
    get() { return md },
    set(md: string) {
      renderMD(md)
      Prism.highlightAll()
      Reveal.toggleOverview();
      Reveal.toggleOverview(); // just refresh all slides
    }
  })
}

const redirect = decodeURIComponent(new URLSearchParams(location.search).get('redirect') || '')
if (redirect) {
  if (mdMap[redirect]) {
    location.pathname = redirect
  } else {
    location.pathname = baseurl
  }
}
