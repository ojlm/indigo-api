export class EventSourceSubscriber {

  private es: EventSource
  private onClose: () => void

  constructor(eventSource: EventSource, noRetry: boolean = true) {
    this.es = eventSource
    if (noRetry) {
      this.es.onerror = (event: Event) => {
        this.close()
      }
    }
  }
  /** 如果服务端没有指定类型, 会调用这个 */
  subscribeMessage(func: (data: string) => void): EventSourceSubscriber {
    if (func) {
      this.es.onmessage = (data) => func(data.data)
    }
    return this
  }
  /** type: log */
  subscribeLog(func: (data: string) => void): EventSourceSubscriber {
    if (func) {
      this.es.addEventListener('log', (event) => func(event['data']))
    }
    return this
  }
  /** type: json */
  subscribeJson<T>(func: (data: T) => void): EventSourceSubscriber {
    if (func) {
      this.es.addEventListener('json', (event) => {
        if (event['data']) {
          try {
            const obj = JSON.parse(event['data']) as T
            func(obj)
          } catch (error) {
            console.error(error)
          }
        }
      })
    }
    return this
  }
  subscribeClose(func: () => void) {
    if (func) {
      this.onClose = func
    }
    return this
  }
  close() {
    if (this.onClose) {
      this.onClose()
    }
    this.es.close()
  }
}

/**
 * chrome 当服务端流关闭时会重试, 设置 noRetry 会关闭则不重连
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events
 * @see https://stackoverflow.com/questions/24564030/is-an-eventsource-sse-supposed-to-try-to-reconnect-indefinitely
 */
export function newEventSource(url: string, noRetry: boolean = true): EventSourceSubscriber {
  if (window['EventSource']) {
    const sse = new EventSource(url)
    return new EventSourceSubscriber(sse)
  } else {
    return null
  }
}
