import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class AssistantService {

  docUrl = 'https://asura-pro.github.io/indigo-docs'
  defaultItems: AssistantItem[] = [
    { title: 'hosts vs Host', url: `${this.docUrl}/#/zh-cn/bp/hosts-vs-host` },
    { title: 'context', url: `${this.docUrl}/#/zh-cn/context` },
  ]

  getItems(url: string): AssistantItem[] {
    return this.defaultItems
  }
}

export interface AssistantItem {
  title?: string
  url?: string
}
