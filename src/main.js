import Reveal from 'reveal.js'
import Prism from 'prismjs'

if (process.env.NODE_ENV === 'development') {
  document.querySelector('.slides').innerHTML = require('./vue-ssr/index.pug')
  const { title, description, favicon, themeColor } = require('./vue-ssr/meta.json')
  document.title = title
  document.querySelector('meta[name="description"]').content = description
  document.querySelector('meta[name="theme-color"]').content = themeColor
  document.querySelector('link[rel="shortcut icon"]').href = favicon
  document.querySelector('style').textContent = `:root { --theme-color: ${themeColor} }`
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

litdom('section', d => {
  if (d.childNodes[0] && d.childNodes[0].nodeType === 3) {
    const span = document.createElement('span')
    span.textContent = d.childNodes[0].textContent
    span.className = 'g-theme-color'
    d.childNodes[0].replaceWith(span)
  }
})

Prism.highlightAll()
