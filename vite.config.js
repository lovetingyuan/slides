import { defineConfig } from 'vite'
import { readFileSync } from 'fs'
import marked from 'marked'
import pug from 'pug'
// https://vitejs.dev/config/
const toRaw = s => {
  return JSON.stringify(s).replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}
export default defineConfig({
  plugins: []
})
