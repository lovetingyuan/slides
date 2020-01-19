const path = require('path')
const fs = require('fs')
const { src, dest } = require('gulp')

function main () {
  return src('dist/**/*').pipe(
    dest(__dirname)
  )
}

exports.default = main
