import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { I18NService } from '@core'
import { I18nKey } from '@core/i18n/i18n.message'
import { SortablejsOptions } from 'angular-sortablejs'
import { SelectModel } from 'app/model/common.model'
import { TransformFunction, VariablesExportItem } from 'app/model/es.model'
import { AutocompleteContext } from 'app/model/indigo.model'

@Component({
  selector: 'app-variables-export-table',
  templateUrl: './variables-export-table.component.html',
  styles: [`
    .func-option {
    }
    .option-title {
      border-bottom: 1px solid lightgrey;
    }
    .func-option:hover .option-title {
      font-weight: 600;
    }
    .option-content {
      max-height: 120px;
      overflow: auto;
      color: lightgrey;
      white-space: normal;
      word-break: break-all;
      word-wrap: break-word;
    }
  `]
})
export class VariablesExportTableComponent implements OnInit {

  sortablejsOptions: SortablejsOptions = {
    handle: '.anticon-bars',
    onUpdate: function (event: any) {
      this.dataChange.emit(this.data)
    }.bind(this)
  }
  scopes: SelectModel[] = [
    { label: this.i18nService.fanyi(I18nKey.ItemScopeGlobal), value: ScopeType.GLOBAL },
    { label: this.i18nService.fanyi(I18nKey.ItemScopeJob), value: ScopeType.JOB },
    { label: this.i18nService.fanyi(I18nKey.ItemScopeScenario), value: ScopeType.SCENARIO }
  ]
  @Input() autocompleteContext = new AutocompleteContext()
  @Input() transforms: TransformFunction[] = []
  _defaultScope: string
  @Input()
  set defaultScope(val: string) {
    if (val) {
      this._defaultScope = val
    }
  }
  values: VariablesExportItem[]
  @Input()
  get data() {
    return this.values
  }
  set data(val: VariablesExportItem[]) {
    if (val && val.length > 0) {
      if (this.isAnEmptyItem(val[val.length - 1])) {
        this.values = val
      } else {
        this.values = [...val, this.initNewItem()]
      }
    } else {
      this.values = [this.initNewItem()]
    }
  }
  @Output()
  dataChange = new EventEmitter<VariablesExportItem[]>()

  constructor(
    private i18nService: I18NService
  ) { }

  isAnEmptyItem(item: VariablesExportItem) {
    if (item.srcPath && item.dstName && item.scope) {
      return false
    } else {
      return true
    }
  }

  initNewItem() {
    const item: VariablesExportItem = {
      scope: this._defaultScope || ScopeType.GLOBAL,
    }
    return item
  }

  modelChange(item: VariablesExportItem, index: number) {
    if (item.enabled === undefined) {
      item.enabled = true
    }
    if (index === this.values.length - 1) {
      this.values.push(this.initNewItem())
      this.values = [...this.values]
    }
    this.dataChange.emit(this.data)
  }

  remove(index: number) {
    if (index === this.data.length) return
    if (this.data.length > 0) {
      this.values.splice(index, 1)
      this.values = [...this.values]
      this.dataChange.emit(this.data)
    } else {
      this.values = []
      this.dataChange.emit(this.data)
    }
  }

  ngOnInit(): void {
  }
}

export const ScopeType = {
  GLOBAL: '_g',
  JOB: '_j',
  SCENARIO: '_s',
}
