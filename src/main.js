import Reveal from 'reveal.js'
import Prism from 'prismjs'
import './vite'

Reveal.initialize({
  slideNumber: 'c/t',
  fragmentInURL: true,
  history: true,
  transition: 'concave',
  pdfSeparateFragments: false
})

setTimeout(() => {
  Prism.highlightAll()
})
