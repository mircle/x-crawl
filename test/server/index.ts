import http from 'node:http'

http
  .createServer((req, res) => {
    console.log(req.headers)

    res.setHeader('Content-Type', 'text/plain')
    res.end('success')
  })
  .listen(8888, () => {
    console.log(`服务器在 8888 端口启动成功~`)
  })
