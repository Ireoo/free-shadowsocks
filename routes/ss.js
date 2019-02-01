const router = require('express').Router()
const fs = require('fs')
const path = require('path')

exports = module.exports = router

router.auth = false
router.path = '/'

router.all('/', (req, res) => {
  res.header('content-disposition', 'attachment; filename=Free-Shadowsocks.txt')
  res.header('Content-Type', 'application/octet-stream; charset=utf-8')
  if (fs.existsSync(path.join(process.cwd(), 'proxy.txt'))) {
    res.send(fs.readFileSync(path.join(process.cwd(), 'proxy.txt'), 'utf8'))
  } else {
    res.status(404).send('NOT FOUND.')
  }
})
