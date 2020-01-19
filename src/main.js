import Reveal from 'reveal.js'
import Prism from 'prismjs'

if (process.env.NODE_ENV === 'development') {
  document.querySelector('.slides').innerHTML = require('./aaa/index.pug')
}

Reveal.initialize({
  slideNumber: 'c/t',
  fragmentInURL: true,
  history: true,
  transition: 'concave'
})

Prism.highlightAll()
