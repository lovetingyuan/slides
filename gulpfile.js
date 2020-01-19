exports.default = function () {
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
