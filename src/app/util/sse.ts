export class EventSourceSubscriber {

  private es: IEventSourceStatic
  private onClose: () => void

  constructor(eventSource: IEventSourceStatic, noRetry: boolean = true) {
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
      this.es.addEventListener('log', (event) => func(event.data))
    }
    return this
  }
  /** type: json */
  subscribeJson<T>(func: (data: T) => void): EventSourceSubscriber {
    if (func) {
      this.es.addEventListener('json', (event) => {
        if (event.data) {
          try {
            const obj = JSON.parse(event.data) as T
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
    const sse = (new window['EventSource'](url)) as IEventSourceStatic
    return new EventSourceSubscriber(sse)
  } else {
    return null
  }
}

/**
 * 临时声明, https://github.com/Microsoft/TypeScript/issues/13666
 */
/** The readyState attribute represents the state of the connection. */
enum ReadyState {

  /** The connection has not yet been established, or it was closed and the user agent is reconnecting. */
  CONNECTING = 0,

  /** The user agent has an open connection and is dispatching events as it receives them. */
  OPEN = 1,

  // tslint:disable-next-line:max-line-length
  /** The connection is not open, and the user agent is not trying to reconnect. Either there was a fatal error or the close() method was invoked. */
  CLOSED = 2
}

interface IEventSourceStatic {
  // tslint:disable-next-line:no-misused-new
  new(url: string, eventSourceInitDict?: IEventSourceInit): IEventSourceStatic
  /** The serialisation of this EventSource object's url. */
  url: string
  withCredentials: boolean
  /** Always 0 */
  CONNECTING: ReadyState
  /** Always 1 */
  OPEN: ReadyState
  /** Always 2 */
  CLOSED: ReadyState
  /** The ready state of the underlying connection. */
  readyState: ReadyState
  onopen: (event: Event) => any
  onmessage: (event: IOnMessageEvent) => void
  onerror: (event: Event) => any
  // tslint:disable-next-line:max-line-length
  /** The close() method must abort any instances of the fetch algorithm started for this EventSource object, and must set the readyState attribute to CLOSED. */
  close: () => void
  addEventListener: (type: string, h: (event: IOnMessageEvent) => void) => void
  removeEventListener: (type: string, h: (event: IOnMessageEvent) => void) => void
}

interface IEventSourceInit {
  /** Defines if request should set corsAttributeState to true.  */
  withCredentials?: boolean
}

interface IOnMessageEvent {
  data: string
}
