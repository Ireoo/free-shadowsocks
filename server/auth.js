const fs = require('fs')
const path = require('path')

const express = require('express')
const router = express.Router()

exports = module.exports = router

/**
 * 首页内容
 */
router.use((req, res, next) => {
  next()
})
