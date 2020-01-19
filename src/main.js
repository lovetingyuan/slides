import Reveal from 'reveal.js'
import Prism from 'prismjs'

if (process.env.NODE_ENV === 'development') {
  document.querySelector('.slides').innerHTML = require('./vue-ssr/index.pug')
}

Reveal.initialize({
  slideNumber: 'c/t',
  fragmentInURL: true,
  history: true,
  transition: 'concave'
})

function litdom (selector, callback) {
  const selectors = Array.isArray(selector) ? selector : [selector]
  selectors.forEach(s => {
    document.querySelectorAll(s).forEach((...args) => {
      callback(...args, s)
    })
  })
}

litdom(['pre', 'code'], d => {
  if (!d.className) {
    d.className = 'language-javascript'
  }
})

Prism.highlightAll()
