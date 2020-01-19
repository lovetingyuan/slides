const path = require('path')
const fs = require('fs')

const Bundler = require('parcel-bundler')

const dist = path.join(__dirname, 'dist')
const src = path.join(__dirname, 'src')
const defaultThemeColor = 'darkseagreen'

async function buildSlides (names) {
  // Bundler options
  const options = {
    outDir: dist,
    publicUrl: './',
    cacheDir: path.join(__dirname, 'node_modules', '.cache', 'parcel'),
    contentHash: true,
    sourceMaps: false, // Enable or disable sourcemaps, defaults to enabled (minified builds currently always create sourcemaps)
    detailedReport: true, // Prints a detailed report of the bundles, assets, filesizes and times, defaults to false, reports are only printed if watch is disabled
  }

  const entries = names.map(n => {
    return path.join(src, n, 'index.pug')
  }).concat(path.join(src, 'index.html'))

  const bundler = new Bundler(entries, options)
  const bundle = await bundler.bundle()
  await bundler.stop()
}

function inject (slides) {
  const appContentReg = /<!--\[if APP-START\]><!\[endif\]-->[\s\S]+?<!--\[if APP-END\]><!\[endif\]-->/m
  const index = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
  slides.forEach(name => {
    const meta = require(path.join(src, name, 'meta.json'))
    const {
      title, description, themeColor = defaultThemeColor
    } = meta
    const slide = fs.readFileSync(path.join(dist, name, 'index.html'), 'utf8')
    const result = index.replace(appContentReg, slide)
      .replace(/<title><\/title>/, `<title>${title}</title>`)
      .replace(/<meta name="description" content="">/, `<meta name="description" content=${JSON.stringify(description)}>`)
      .replace(/<meta name="theme-color" content="">/, `<meta name="theme-color" content="${themeColor}">`)
      .replace(/--theme-color:""/, `--theme-color: '${themeColor}';`)
    fs.writeFileSync(path.join(dist, name, 'index.html'), result)
  })
  fs.writeFileSync(path.join(dist, 'index.html'), `
    <main style="padding: 50px;">
    <h3>slides:</h3>
    <ul>${
      slides.map(v => `<li><p><a href="/slides/${v}">${v}</a></p></li>`).join('')
    }</ul>
    </main>
  `)
}

async function main () {
  const slides = fs.readdirSync(src).filter(v => {
    try {
      require.resolve(path.join(src, v, 'meta.json'))
      return v
    } catch (err) {}
  })
  await buildSlides(slides)
  inject(slides)
}

exports.default = main
