const express = require('express')
const cors = require('cors')
const path = require('path')
const basePath = '/amt/amt-pamelding-flate'
const buildPath = path.resolve(__dirname, '../dist')
const server = express()
const corsAllowedOrigins = process.env.CORS_ALLOWED_ORIGINS.split(',')

server.use(cors({ origin: corsAllowedOrigins }))

server.use(basePath, express.static(buildPath))

server.get(`${basePath}/internal/isAlive`, (req, res) => {
  res.sendStatus(200)
})

server.get(`${basePath}/internal/isReady`, (req, res) => {
  res.sendStatus(200)
})

server.listen(8080, () => console.log('Server listening on port 8080!'))
