const PROXY_CONFIG = [{
  context: [
    "/api/ws",
  ],
  target: "ws://localhost:8080",
  pathRewrite: {
    '^/api': ''
  },
  ws: true,
  secure: false
},
{
  context: [
    "/api",
  ],
  target: "http://localhost:8080",
  pathRewrite: {
    '^/api': ''
  },
  secure: false
}
]

module.exports = PROXY_CONFIG
