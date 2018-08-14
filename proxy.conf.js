const PROXY_CONFIG = [{
    context: [
      "/api/ws",
    ],
    target: "ws://localhost:9000",
    pathRewrite: {
      '^/api': '/api'
    },
    ws: true,
    secure: false
  },
  {
    context: [
      "/api",
    ],
    target: "http://localhost:9000",
    pathRewrite: {
      '^/api': '/api'
    },
    secure: false
  }
]

module.exports = PROXY_CONFIG
