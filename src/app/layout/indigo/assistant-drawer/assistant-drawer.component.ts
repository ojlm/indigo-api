import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef } from '@angular/core'
import { Event, NavigationEnd, NavigationStart, Router } from '@angular/router'
import { AssistantItem, AssistantService } from '@core/config/assistant.service'

@Component({
  selector: 'app-assistant-drawer',
  templateUrl: './assistant-drawer.component.html',
  styleUrls: ['./assistant-drawer.component.css'],
  host: { '[class.assistant-drawer]': 'true' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssistantDrawerComponent implements AfterViewInit {

  collapse = false
  docUrl = ''
  assistantItems: AssistantItem[] = []
  handle: HTMLDivElement

  constructor(
    private router: Router,
    private assistantService: AssistantService,
    private el: ElementRef,
  ) {
    this.router.events.subscribe(event => {
      this.routerChangeEvent(event)
    })
    this.assistantItems = this.assistantService.getItems('')
    this.docUrl = this.assistantService.docUrl
  }

  open(item: AssistantItem) {
    if (item.url) window.open(item.url)
  }

  showDoc() {
    if (this.docUrl) {
      window.open(this.docUrl)
    }
  }

  routerChangeEvent(event: Event) {
    if (event instanceof NavigationStart) {
    } else if (event instanceof NavigationEnd) {
      this.assistantItems = this.assistantService.getItems((event as NavigationEnd).url)
      if (this.handle) {
        this.handle.classList.add('handle-animation')
        if (this.handle.classList.contains('handle-animation')) {
          this.handle.classList.remove('handle-animation')
        }
        const asyncAdd = () => this.handle.classList.add('handle-animation')
        setTimeout(asyncAdd, 1)
      }
    }
  }

  toggle() {
    this.collapse = !this.collapse
  }

  ngAfterViewInit() {
    this.handle = (this.el.nativeElement as HTMLElement).querySelector('.assistant-handle') as HTMLDivElement
  }
}
