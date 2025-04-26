'use strict'
console.log('[taskfile-babel] loaded');

const path = require('path')
const extname = path.extname
const { transformSync } = require('@babel/core')

module.exports = function (task) {
  task.plugin('babel', {}, function * (file, babelOpts, { stripExtension } = {}) {
    const options = {
      ...babelOpts,
      compact: true,
      babelrc: false,
      configFile: false,
      filename: file.base,
      sourceMaps: true,           // ✅ 强制开启 sourcemaps
     
      inputSourceMap: false
    }

    // Include declaration files as they are
    if (file.base.endsWith('.d.ts')) return

    const ext = extname(file.base)
    const output = transformSync(file.data.toString(), options)

    // 设置新的文件名
    if (ext) {
      const extRegex = new RegExp(ext.replace('.', '\\.') + '$', 'i')
      file.base = file.base.replace(extRegex, stripExtension ? '' : '.js')
    }

    // Workaround for noop.js loading
    let code = output.code
    if (file.base === 'next-dev.js') {
      code = code.replace(
        '// REPLACE_NOOP_IMPORT',
        `import('./dev/noop');`
      )
    }

    // ✅ 注入版本号、设置代码和 map
    file.data = Buffer.from(setNextVersion(code))

    if (output.map) {
 

      console.log('✅ Babel generated source map for:', file.base)
      file.map = output.map
    
      const fs = require('fs')
      const path = require('path')
      const distFilePath = path.join('dist', file.dir || '', file.base)
      const mapPath = distFilePath + '.map'
    
      fs.mkdirSync(path.dirname(mapPath), { recursive: true })
      fs.writeFileSync(mapPath, JSON.stringify(output.map))
      console.log('✔ sourcemap written to:', mapPath)






    } else {
      console.log('❌ No source map generated for:', file.base)
    }
  })
}

function setNextVersion(code) {
  return code.replace(
    /process\.env\.__NEXT_VERSION/g,
    `"${require('./package.json').version}"`
  )
}
