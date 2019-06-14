import { DOWN_ARROW, ENTER, UP_ARROW } from '@angular/cdk/keycodes'
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core'
import { VariablesExportItem } from 'app/model/es.model'
import { AutocompleteContext, AutocompleteContextDataSource } from 'app/model/indigo.model'
import jsonpath from 'jsonpath/jsonpath.min'

@Component({
  selector: 'app-export-auto-complete',
  templateUrl: './export-auto-complete.component.html',
  styleUrls: ['./export-auto-complete.component.css']
})
export class ExportAutoCompleteComponent implements OnInit, AfterViewInit {

  prefix = '$'
  dataSource: AutocompleteContextDataSource = {
    status: 200,
    headers: {},
    entity: {}
  }
  preStyles = {
    'max-height': '200px',
    'overflow-y': 'auto',
    'width': '200px'
  }
  options: string[] = []
  optionIndex = 0
  tipsContent = ''
  @Input()
  set autocompleteContext(val: AutocompleteContext) {
    if (val) {
      this.prefix = val.prefix || '$'
      if (val.dataSource) {
        this.dataSource = val.dataSource
      } else {
        this.dataSource = {
          status: 200,
          headers: {},
          entity: {}
        }
      }
    }
  }
  @Input() item: VariablesExportItem = {}
  @Output() itemChange = new EventEmitter<VariablesExportItem>()
  @ViewChild('pathInput') pathInput: ElementRef

  constructor() {
  }

  emitItemChange() {
    this.itemChange.emit(this.item)
  }

  onExpChange() {
    this.optionIndex = 0
    if (this.item.srcPath) {
      this.currentLevelOptions()
    } else {
      this.nextLevelOptions(this.dataSource, this.prefix)
    }
  }

  nextLevelOptions(data: object, prefixExp: string) {
    const newOptions = []
    for (const key in data) {
      newOptions.push(`${prefixExp}.${key}`)
    }
    this.options = newOptions
  }

  currentLevelOptions(clickedOption?: string) {
    const currentPath = clickedOption || this.item.srcPath
    try {
      // jsonpath's response must be an array
      const array = jsonpath.query(this.dataSource, currentPath)
      if (array.length > 0) {
        const data = array[0]
        if (typeof data === 'object') {
          if (data instanceof Array && data.length > 0) {
            this.options = [`${currentPath}[]`]
          } else {
            this.nextLevelOptions(data, currentPath)
          }
        } else {
          this.options = []
          if (typeof data === 'string' || typeof data === 'number') {
            const splits = currentPath.split('.')
            if (splits.length > 1) {
              this.item.dstName = splits[splits.length - 1]
            }
            this.emitItemChange()
          }
        }
      } else {
        this.options = this.options.filter(option => option.toLowerCase().startsWith((currentPath.toLowerCase())))
      }
    } catch (err) {
      if (currentPath.indexOf('[') >= 0) {
        this.options = []
      }
    }
  }

  onKeyDown(event: KeyboardEvent) {
    event.stopPropagation()
    if (event.keyCode === ENTER) {
      if (this.options.length > 0) {
        this.item.srcPath = this.options[this.optionIndex]
        this.currentLevelOptions()
      }
    } else if (event.keyCode === UP_ARROW) {
      this.optionIndex--
      if (this.optionIndex < 0) {
        this.optionIndex = this.options.length - 1
      }
    } else if (event.keyCode === DOWN_ARROW) {
      this.optionIndex++
      if (this.optionIndex >= this.options.length) {
        this.optionIndex = 0
      }
    }
  }

  onOptionClick(option: string) {
    if (this.pathInput) {
      (<HTMLElement>this.pathInput.nativeElement).focus({ preventScroll: true })
    }
    this.item.srcPath = option
    this.emitItemChange()
    this.currentLevelOptions(option)
  }

  onFocus() {
    this.currentLevelOptions(this.item.srcPath || this.prefix)
  }

  onMouseEnter(index: number) {
    this.optionIndex = index
    try {
      this.tipsContent = jsonpath.query(this.dataSource, this.options[index])
      if (typeof (this.tipsContent) === 'object') {
        this.tipsContent = JSON.stringify(this.tipsContent[0], null, '  ')
      }
    } catch (err) {
      this.tipsContent = ''
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
  }
}
