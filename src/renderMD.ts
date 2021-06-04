const gAttrs = ['title', 'style', 'class', 'id']

export function toAttrs(t: string, obj?: boolean) {
  if (!t) return obj ? {} : ''
  const attrObj: Record<string, string> = {}
  const attrsList: string[] = []
  t.split('&').forEach(v => {
    if (!v.trim()) return ''
    const [k, _v] = v.trim().split('=').map(a => a.trim())
    if (gAttrs.includes(k) || k.startsWith('data-')) {
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

type IG = ReturnType<ImportMeta['glob']>

export function renderMd(m: string): void
export function renderMd(m: IG): void
export function renderMd(markdown: string | IG): void {
  const reveal = document.querySelector('.reveal') as HTMLDivElement
  if (typeof markdown === 'object') {
    const names = Object.keys(markdown).map(k => k.split('/')[2])
    reveal.innerHTML = `
    <div style="margin: 50px; font-size: 40px;">
      <h3>Slides:</h3>
      <ul style="margin: 40px 80px;">
        ${ names.map(n => `<li><a href="${n}">${n}</a></li>`).join('') }
      </ul>
    </div>
    `
    return
  }
  let slides = document.querySelector('.slides')

  if (!slides) {
    slides = document.createElement('div')
    slides.className = 'slides'
    reveal.innerHTML = ''
    reveal.appendChild(slides)
  }

  slides.innerHTML = markdown
  const processComment = (children: Node['childNodes']) => {
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
      processComment(child.childNodes)
    })
  }
  processComment(slides.childNodes)
  slides.querySelectorAll('a').forEach(a => {
    if (!a.target) a.target = '_blank'
  })

  let exportBtn = document.getElementById('export-btn')
  const url = new URL(location.href)
  const isPDFMode = url.searchParams.has('print-pdf')
  if (!exportBtn) {
    exportBtn = document.createElement('div')
    exportBtn.id = 'export-btn'
    exportBtn.title = 'PDF'
    document.body.appendChild(exportBtn)
    exportBtn.addEventListener('click', () => {
      if (isPDFMode) {
        window.print()
      } else {
        url.searchParams.set('print-pdf', '')
        location.href = url.toString()
      }
    })
  }
}
