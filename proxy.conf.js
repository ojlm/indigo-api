const PROXY_CONFIG = [{
    context: [
      "/api/ws",
    ],
    target: "ws://localhost:9000",
    pathRewrite: {
      '^/api/': '/api/'
    },
    ws: true,
    changeOrigin: true,
    secure: false
  },
  {
    context: [
      "/api/",
    ],
    target: "http://localhost:9000",
    pathRewrite: {
      '^/api/': '/api/'
    },
    changeOrigin: true,
    secure: false
  },
  {
    context: [
      "/openapi",
    ],
    target: "http://localhost:9000",
    pathRewrite: {
      '^/openapi': '/openapi'
    },
    changeOrigin: true,
    secure: false
  }
]

module.exports = PROXY_CONFIG
