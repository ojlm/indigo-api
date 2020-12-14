export function newWS(path: string): WebSocket {
  return new WebSocket(newWSUrl(path))
}

export function newWSUrl(path: string): string {
  let url: string
  if (location.protocol.startsWith('https')) {
    url = `wss://${location.host}${path}`
  } else {
    url = `ws://${location.host}${path}`
  }
  return url
}
