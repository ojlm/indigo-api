import { AfterContentInit, Directive, ElementRef, HostListener, Renderer2 } from '@angular/core'

@Directive({
  selector: '[appExportAutocomplete]'
})
export class ExportAutoCompleteDirective implements AfterContentInit {

  optionsNode: HTMLElement
  private wasInside = false

  @HostListener('click')
  clickInside() {
    this.displayOptionsList(true)
    this.wasInside = true
  }

  @HostListener('document:click')
  clickOutside() {
    if (!this.wasInside) {
      this.displayOptionsList(false)
    }
    this.wasInside = false
  }

  constructor(private eRef: ElementRef, private renderer: Renderer2) {
  }

  displayOptionsList(isShow: boolean) {
    if (this.optionsNode) {
      if (isShow) {
        this.renderer.setStyle(this.optionsNode, 'display', 'block')
      } else {
        this.renderer.setStyle(this.optionsNode, 'display', 'none')
      }
    }
  }

  ngAfterContentInit() {
    this.optionsNode = (<HTMLElement>this.eRef.nativeElement).querySelector('ul')
  }
}
