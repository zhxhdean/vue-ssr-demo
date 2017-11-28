const Vue = require('vue')
const express = require('express')
const fs = require('fs')
const path = require('path')
const lru = require('lru-cache')
const vueRenderer = require('vue-server-renderer')

const server = express()
server.use(express.static('dist'));

const resolve = file => path.resolve(__dirname, file)

// https://ssr.vuejs.org/zh/api.html#webpack-plugins
const createRender = bundle => {
  return vueRenderer.createBundleRenderer(bundle, {
    // 推荐
    runInNewContext: false,
    // 模板html文件
    template: fs.readFileSync(resolve('./index.html'), 'utf-8'),
    // client manifest
    clientManifest: require('./dist/vue-ssr-client-manifest.json')
  })
}

const parseHTML = tmpl => {
  const placeholder = '<body>'
  const i = tmpl.indexOf(placeholder)
    return {
      head: tmpl.slice(0, i),
      tail: tmpl.slice(i)
    }
}

const parseMeta = (head, context) => {
  const title = context.title || '服务端数据渲染-标题'
  const description = context.description || '服务端数据渲染-描述'
  const keywords = context.keywords || 'ssr,vue,node,服务端渲染'
  head = head.replace(/(<title>)(.*?)(<\/title>)/, `$1${title}$3`)
  head = head.replace(/(<meta name=\"description\" content=")(.*?)("\/>)/, `$1${description}$3`)
  head = head.replace(/(<meta name=\"keywords\" content=")(.*?)("\/>)/, `$1${keywords}$3`)
  return head
}
let indexHTML = parseHTML(fs.readFileSync(resolve('./index.html'), 'utf-8'))
let renderer = createRender(require('./dist/vue-ssr-server-bundle.json'))
server.get('*', (req, res) => {
  if (!renderer) {
    return res.end('the renderer is not ready,just wait a minute')
  }
  res.setHeader('Content-Type', 'text-html')

  const context = {
    url: req.url,
    title: 'hello',
    meta : `
    <meta name="description" content="描述"/>
    <meta name="keywords" content="关键字"/>`
  }
  const renderStream = renderer.renderToStream(context)


  renderStream.on('data', chunk => {
    res.write(chunk)
  })

  renderStream.on('end', () => {
    if (context.initialState) {
      res.write(`<script>window.__INITIAL_STATE__=${serialize(context.initialState, {isJSON: true})
        }</script>`)}

      res.end('')})

    renderStream.on('error', err => {
      if (err && err.code === '404') {
        res
          .status(404)
          .end('404 | Page Not Found')
        return
      }
      res
        .status(500)
        .end('Internal Error 500')
    });
  })

  const PORT = process.env.PORT || 8088
  const HOST = process.env.HOST || 'localhost'

  server.listen(PORT, HOST, () => {
    console.log(`server started at ${HOST}:${PORT} `)
  })
