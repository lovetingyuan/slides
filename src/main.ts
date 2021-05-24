import Reveal from 'reveal.js'
import Prism from 'prismjs'

import renderMD from './renderMD'

let md: string = ''

export default function start(_md: string) {
  renderMD(_md, '.slides')
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
      renderMD(md, '.slides')
      Prism.highlightAll()
      Reveal.toggleOverview();
      Reveal.toggleOverview(); // just refresh all slides
    }
  })
}
