const { defineConfig } = require('@vue/cli-service')
const fs = require('fs')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
  open: process.platform === 'darwin',
  host: '0.0.0.0',
  port: 8080,
  https: {
    options:{
      key: fs.readFileSync('./.certs/localhost-key.pem'),
      cert: fs.readFileSync('./.certs/localhost.pem'),
    }
  },
  },
})