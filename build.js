const esbuild = require('esbuild')

esbuild.build({
  entryPoints: ['src/useSnowfall.js'],
  bundle: true,
  format: 'esm',
  outfile: 'dist/useSnowfall.js',
  minify: true,
  target: 'es2020',
  platform: 'browser',
  external: [],
}).catch(() => process.exit(1))

// Also create index.js that re-exports
const fs = require('fs')
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist')
}
fs.writeFileSync('dist/index.js', "export { useSnowfall } from './useSnowfall.js';\n")

console.log('✓ Build complete: dist/useSnowfall.js (minified)')

