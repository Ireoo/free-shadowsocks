const fs = require('fs')
const path = require('path')

const nightmare = require('nightmare')
const cheerio = require('cheerio')
const { execSync } = require('child_process')

const Base64 = require('js-base64').Base64

const getProxy = () => {
  return new Promise((res, err) => {
    NG = nightmare({
      show: true,
      // switches: {
      //   "proxy-server": proxy,
      //   "ignore-certificate-errors": true
      // },
      openDevTools: {
        mode: 'bottom' // 开发者工具位置：right, bottom, undocked, detach
      },
      loadTimeout: 30000,
      waitTimeout: 300000
    })
    NG.useragent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36'
    ) // 必须设置浏览器信息
      .viewport(800, 400)
      .goto(`https://free-ss.site/`)
      .wait('body > div.container > div.main > div:nth-child(7) > table > tbody > tr')
      .wait(3000)
      .evaluate(() => {
        return document.body.innerHTML
      })
      .end()
      .then(html => {
        // console.log(html)
        const $ = cheerio.load(html)
        let proxys = []
        let trs = $('body > div.container > div.main > div:nth-child(7) > table > tbody > tr')
        for (let i = 0; i < trs.length; i++) {
          let tr = $('body > div.container > div.main > div:nth-child(7) > table > tbody > tr').eq(i)
          let proxy = `ssr://${Base64.encode(
            `${tr
              .find('td')
              .eq(1)
              .text()}:${tr
              .find('td')
              .eq(2)
              .text()}:origin:${tr
              .find('td')
              .eq(4)
              .text()}:plain:${Base64.encode(
              tr
                .find('td')
                .eq(3)
                .text()
            )}`
          )}/?remarks=ZnJlZQ0Kc2hhZG93c29ja3MNCg&group=ZnJlZQ0Kc2hhZG93c29ja3MNCg`
          // console.log(proxy)
          if (proxy !== '') proxys.push(proxy)
        }
        res(proxys)
      })
      .catch(e => {
        err(e)
      })
  })
}

// exports = module.exports = getProxy
const get = () => {
  getProxy()
    .then(data => {
      console.log(data)
      if (data.length > 1) {
        fs.writeFileSync(path.join(process.cwd(), 'proxy.txt'), Base64.encode(data.join('\r\n')))
        execSync(`git add . && git commit -m "update" && git push`)
      } else {
        throw new error(`No Data.`)
      }
      setTimeout(() => {
        get()
      }, 1000 * 60 * 60)
    })
    .catch(e => {
      console.log(e)
      // setTimeout(() => {
      get()
      // }, 1000 * 60 * 60)
    })
}

get()
