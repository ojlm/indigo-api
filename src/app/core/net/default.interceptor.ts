import {
  HttpErrorResponse,
  HttpHandler,
  HttpHeaderResponse,
  HttpInterceptor,
  HttpProgressEvent,
  HttpRequest,
  HttpResponse,
  HttpSentEvent,
  HttpUserEvent,
} from '@angular/common/http'
import { Injectable, Injector } from '@angular/core'
import { Router } from '@angular/router'
import { I18NService } from '@core/i18n/i18n.service'
import { _HttpClient } from '@delon/theme'
import { environment } from '@env/environment'
import { NzMessageService } from 'ng-zorro-antd'
import { Observable, of } from 'rxjs'
import { mergeMap } from 'rxjs/operators'

import { APICODE, ApiResObj } from '../../model/api.model'

/**
 * 默认HTTP拦截器，其注册细节见 `app.module.ts`
 */
@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) { }

  get msg(): NzMessageService {
    return this.injector.get(NzMessageService)
  }

  get i18N(): I18NService {
    return this.injector.get(I18NService)
  }

  private goTo(url: string) {
    setTimeout(() => this.injector.get(Router).navigateByUrl(url))
  }

  private handleData(
    event: HttpResponse<any> | HttpErrorResponse,
  ): Observable<any> {
    // 可能会因为 `throw` 导出无法执行 `_HttpClient` 的 `end()` 操作
    this.injector.get(_HttpClient).end()
    // 业务处理：一些通用操作
    switch (event.status) {
      case 200:
        // 业务层级错误处理，以下是假定restful有一套统一输出格式（指不管成功与否都有相应的数据格式）情况下进行处理
        if (event instanceof HttpResponse) {
          const body: ApiResObj = event.body
          if (body && body.code !== APICODE.OK) {
            this.msg.error(body.msg)
            return Observable.create(obs => obs.error(event))
          } else {
            return of(event)
          }
        }
        break
      case 401: // 未登录状态码
        this.goTo('/passport/login')
        break
      case 403:
      case 404:
      case 500:
        this.goTo(`/${event.status}`)
        break
      default:
        if (event instanceof HttpErrorResponse) {
          console.warn(
            '未可知错误，大部分是由于后端不支持CORS或无效配置引起',
            event,
          )
          this.msg.error(event.message)
        }
        break
    }
    return of(event)
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<
  | HttpSentEvent
  | HttpHeaderResponse
  | HttpProgressEvent
  | HttpResponse<any>
  | HttpUserEvent<any>
  > {
    // 统一加上服务端前缀
    let url = req.url
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      url = environment.SERVER_URL + url
    }
    const lang = this.i18N.currentLang
    const newReq = req.clone({
      url: url,
      headers: req.headers.append('Local', lang)
    })
    return next.handle(newReq).pipe(
      mergeMap((event: any) => {
        // 允许统一对请求错误处理，这是因为一个请求若是业务上错误的情况下其HTTP请求的状态是200的情况下需要
        if (event instanceof HttpResponse && event.status === 200 && req.url.startsWith('api/')) {
          return this.handleData(event)
        } else {
          // 若一切都正常，则后续操作
          return of(event)
        }
      }),
    )
  }
}
