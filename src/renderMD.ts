const gattrs = ['title', 'style', 'class', 'id']

export function toAttrs(t: string, obj?: boolean) {
  if (!t) return obj ? {} : ''
  const attrObj: Record<string, string> = {}
  const attrsList: string[] = []
  t.split('&').forEach(v => {
    if (!v.trim()) return ''
    const [k, _v] = v.trim().split('=').map(a => a.trim())
    if (gattrs.includes(k) || k.startsWith('data-')) {
      if (obj) {
        attrObj[k] = _v
      } else {
        attrsList.push(`${k}=${JSON.stringify(_v)}`)
      }
    } else {
      if (obj) {
        attrObj[`data-${k}`] = _v;
      } else {
        attrsList.push(`data-${k}=${JSON.stringify(_v)}`)
      }
    }
  })
  return obj ? attrObj : attrsList.join(' ')
}

export default function renderMD(markdown: string, container: string | HTMLElement) {
  let _container: HTMLElement
  if (typeof container === 'string') {
    _container = document.querySelector(container) as HTMLElement
  } else {
    _container = container
  }
  if (!_container) {
    throw new Error('invalid container for renderMD')
  }
  _container.innerHTML = markdown
  const processText = (children: Node['childNodes']) => {
    children && children.length && Array.from(children).forEach(child => {
      if (!child) return
      if (child.nodeType === 8) {
        const comment = (child.textContent || '').trim()
        if (!comment) return
        const target = (child as Comment).nextElementSibling || child.parentElement
        if (!target) return
        if (comment === 'fragment') {
          target.classList.add('fragment')
        } else {
          const attrs = toAttrs(comment, true) as Record<string, string>
          Object.keys(attrs).forEach(k => {
            target.setAttribute(k, attrs[k])
          })
        }
      }
      processText(child.childNodes)
    })
  }
  processText(_container.childNodes)
  _container.querySelectorAll('a').forEach(a => {
    if (!a.target) a.target = '_blank'
  })
  _container.querySelectorAll('code').forEach(a => {
    a.dataset.trim = ''
    a.dataset.noescape = ''
    if (!a.dataset.lineNumbers) {
      a.dataset.lineNumbers = ''
    }
  })
  _container.querySelectorAll('script').forEach(script => {
    const s = document.createElement('script')
    s.textContent = script.textContent
    if (script.src) {
      s.src = script.src
    }
    document.head.appendChild(s)
  })
}