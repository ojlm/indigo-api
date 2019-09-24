import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { MonacoService } from '@core/config/monaco.service'
import {
  AssertionItems,
  assertionItemsAdaptAssertObject,
  assertObjectToAssertionItems,
} from '@shared/assertion-list/assertion-list.component'
import { ConfigService } from 'app/api/service/config.service'
import { AutocompleteContext } from 'app/model/indigo.model'
import * as screenfull from 'screenfull'

import { Assertion } from '../../model/es.model'
import { formatJson } from '../../util/json'

@Component({
  selector: 'app-assertions',
  templateUrl: './assertions.component.html',
  styleUrls: ['./assertions.component.css']
})
export class AssertionsComponent implements OnInit {

  @Input() autocompleteContext = new AutocompleteContext()
  DEFAULT_HEIGHT = '360px'
  componentHeight = '100%'
  isFullscreen = this.sf.isFullscreen
  isFullDocument = false
  assertSimpleEditorMode = true
  wraped = false
  javascriptEditorOption = this.monocoService.getJavascriptOption(false)
  jsonEditorOption = this.monocoService.getJsonOption(false)
  items: AssertionItems = { logic: 'and', items: [] }
  originScript = ''
  currentScript = ''
  contentHeight = this.DEFAULT_HEIGHT
  _height: number // specified height from parent
  @Input()
  set height(val: number) {
    if (val > 0) {
      this._height = val
      this.contentHeight = `${this._height - 32}px`
    }
  }
  @Input() assertions: Assertion[] = []
  _data = {}
  @Input()
  set data(val: object) {
    this._data = val || {}
    this.currentScript = formatJson(this._data, 2)
    this.originScript = this.currentScript
    this.parseAssertionItems()
  }
  @Output()
  dataChange = new EventEmitter<object>()

  constructor(
    private configService: ConfigService,
    private monocoService: MonacoService,
  ) { }

  private get sf(): screenfull.Screenfull {
    return screenfull as screenfull.Screenfull;
  }

  itemsChange() {
    try {
      assertionItemsAdaptAssertObject(this._data, this.items)
      this._data = this._data
      this.currentScript = formatJson(this._data, 2)
      this.modelChange()
    } catch (error) {
      console.error(error)
    }
  }

  fullWindowBtnClick() {
    if (!this.isFullscreen) {
      this.isFullDocument = !this.isFullDocument
      if (this.isFullDocument) {
        this.componentHeight = `${window.innerHeight}px`
        this.contentHeight = `${window.innerHeight - 32}px`
      } else {
        this.componentHeight = '100%'
        if (this._height > 0) {
          this.contentHeight = `${this._height - 32}px`
        } else {
          this.contentHeight = this.DEFAULT_HEIGHT
        }
      }
    }
  }

  fullScreenBtnClick() {
    this.isFullscreen = !this.isFullscreen
    if (this.isFullscreen && this.sf.isEnabled) {
      this.isFullDocument = true
      this.componentHeight = `${screen.height}px`
      this.contentHeight = `${screen.height - 32}px`
    } else {
      this.isFullDocument = false
      this.componentHeight = '100%'
      if (this._height > 0) {
        this.contentHeight = `${this._height - 32}px`
      } else {
        this.contentHeight = this.DEFAULT_HEIGHT
      }
    }
    if (this.sf.isEnabled) {
      this.sf.toggle()
    }
  }

  wrap() {
    this.wraped = !this.wraped
    if (this.wraped) {
      this.jsonEditorOption = { ...this.jsonEditorOption, 'wordWrap': 'on' }
      this.javascriptEditorOption = { ...this.javascriptEditorOption, 'wordWrap': 'on' }
    } else {
      this.jsonEditorOption = { ...this.jsonEditorOption, 'wordWrap': 'off' }
      this.javascriptEditorOption = { ...this.javascriptEditorOption, 'wordWrap': 'off' }
    }
  }

  assertEditorModeChange() {
    this.assertSimpleEditorMode = !this.assertSimpleEditorMode
  }

  formatAssert() {
    try {
      this.currentScript = formatJson(this.currentScript, 2)
      this.modelChange()
    } catch (error) { console.error(error) }
  }

  modelChange() {
    this.dataChange.emit(this._data)
  }

  syncToAssertionItems() {
    if (this.originScript !== this.currentScript) {
      try {
        this._data = JSON.parse(this.currentScript)
        this.parseAssertionItems()
        this.modelChange()
      } catch (error) { }
    }
  }

  parseAssertionItems() {
    const items = assertObjectToAssertionItems(this._data)
    if (items) this.items = items
  }

  ngOnInit(): void {
    if (this.assertions.length === 0) {
      this.configService.getAllAssertions().subscribe(res => {
        this.assertions = res.data
      })
    }
  }
}
