import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { I18NService } from '@core'
import { I18nKey } from '@core/i18n/i18n.message'
import { VariablesOptionsComponent } from '@shared/variables-options/variables-options.component'
import { SelectModel } from 'app/model/common.model'
import { ImportItemType, TransformFunction, VariablesImportItem } from 'app/model/es.model'
import { calcDrawerWidth } from 'app/util/drawer'
import { intputNumFormat, numToInputValue } from 'app/util/number'
import { NzDrawerService } from 'ng-zorro-antd'
import { Options } from 'sortablejs'

@Component({
  selector: 'app-variables-import-table',
  templateUrl: './variables-import-table.component.html',
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
export class VariablesImportTableComponent implements OnInit {

  sortablejsOptions: Options = {
    handle: '.anticon-bars',
    onUpdate: function (event: any) {
      this.dataChange.emit(this.data)
    }.bind(this)
  }
  scopes: SelectModel[] = [
    { label: this.i18nService.fanyi(I18nKey.ItemScopeGlobal), value: ScopeType.GLOBAL },
    { label: this.i18nService.fanyi(I18nKey.ItemScopeJob), value: ScopeType.JOB },
    { label: this.i18nService.fanyi(I18nKey.ItemScopeScenario), value: ScopeType.SCENARIO },
  ]
  values: VariablesImportItem[]
  @Input() transforms: TransformFunction[] = []
  _defaultScope: string
  inited = false
  @Input()
  set defaultScope(val: string) {
    if (val) {
      this._defaultScope = val
    }
  }
  @Input()
  set disableScopes(vals: string[]) {
    if (vals) {
      this.scopes = this.scopes.filter(s => {
        return !(vals.findIndex(val => val === s.value) > -1)
      })
    }
  }
  @Input()
  get data() {
    return this.values
  }
  set data(vals: VariablesImportItem[]) {
    if (vals && vals.length > 0) {
      if (this.isAnEmptyItem(vals[vals.length - 1])) {
        this.values = vals
      } else {
        this.values = [...vals, this.initNewItem()]
      }
      if (!this.inited) {
        // only first time
        formatImportsToShow(this.values)
        this.inited = true
      }
    } else {
      this.values = [this.initNewItem()]
    }
  }
  @Output()
  dataChange = new EventEmitter<VariablesImportItem[]>()

  constructor(
    private drawerService: NzDrawerService,
    private i18nService: I18NService
  ) { }

  isAnEmptyItem(item: VariablesImportItem) {
    if (item.name && (item.value !== undefined && item.value !== null) && item.scope) {
      return false
    } else {
      return true
    }
  }

  initNewItem() {
    const item: VariablesImportItem = {
      scope: this._defaultScope || ScopeType.GLOBAL,
      exposed: true,
    }
    return item
  }

  modelChange(item: VariablesImportItem, index: number) {
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

  typeChange(item: VariablesImportItem) {
    if (item.type) {
      item.type = undefined
    } else {
      if (!item.extra || !item.extra.options) {
        item.extra = { options: [] }
        if (item.extra.options.length === 0) this.showExtra(item)
      }
      item.type = ImportItemType.ENUM
    }
  }

  showExtra(item: VariablesImportItem) {
    this.drawerService.create({
      nzWidth: calcDrawerWidth(0.6),
      nzContent: VariablesOptionsComponent,
      nzContentParams: {
        data: item,
      },
      nzBodyStyle: {
        padding: '16px'
      },
      nzClosable: false,
    })
  }

  ngOnInit(): void {
  }
}

export const ScopeType = {
  GLOBAL: '_g',
  JOB: '_j',
  SCENARIO: '_s',
}

export function formatImportsToSave(imports: VariablesImportItem[]) {
  const newImports = []
  if (imports) {
    imports.forEach(item => {
      const newItem = { ...item }
      newItem.value = intputNumFormat(newItem.value)
      newImports.push(newItem)
    })
  }
  return newImports
}

export function formatImportsToShow(imports: VariablesImportItem[]) {
  imports.forEach(item => {
    item.value = numToInputValue(item.value)
  })
}
