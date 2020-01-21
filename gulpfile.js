const { series } = require('gulp')
const { exec } = require('child_process')

exports.copy = function copy () {
  const { src, dest } = require('gulp')
  const fs = require('fs')
  const path = require('path')
  fs.readdirSync(__dirname).forEach(v => {
    if (/\.[0-9a-z]{8}\./.test(v)) {
      fs.unlinkSync(path.join(__dirname, v))
    }
  })
  return src('dist/**/*').pipe(dest(__dirname))
}

exports.deploy = function deploy (done) {
  const d = new Date
  const date = d.toLocaleString()
  exec(`git status && git add . && git commit -m "${date}" && git push`, {
    cwd: __dirname
  }, (err, stdout) => {
    if (err) return done(err)
    process.stdout.write(stdout + '\n')
    setTimeout(() => {
      process.stdout.write('Done, see https://github.com/lovetingyuan/slides/deployments\n')
      done()
    }, 2000)
  })
}

exports.default = series(exports.copy, exports.deploy)
