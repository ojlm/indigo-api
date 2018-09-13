
export function newWS(path: string): WebSocket {
  let url: string
  if (location.protocol.startsWith('https')) {
    url = `wss://${location.host}${path}`
  } else {
    url = `ws://${location.host}${path}`
  }
  return new WebSocket(url)
}
