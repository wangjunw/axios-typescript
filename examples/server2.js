const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

const router = express.Router()

const cors = {
  'Access-Control-Allow-Origin': 'http://localhost:8999', //允许请求域名
  'Access-Control-Allow-Credentials': true, // 是否可以配置Credentials
  'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
}

router.post('/more/server2', function(req, res) {
  res.set(cors)
  res.json(req.cookies)
})

router.options('/more/server2', function(req, res) {
  res.set(cors)
  res.end()
})

app.use(router)

const port = 7777
module.exports = app.listen(port)
