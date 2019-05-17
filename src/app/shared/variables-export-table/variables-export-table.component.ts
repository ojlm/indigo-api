import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { I18NService } from '@core'
import { I18nKey } from '@core/i18n/i18n.message'
import { SortablejsOptions } from 'angular-sortablejs'
import { SelectModel } from 'app/model/common.model'
import { VariablesExportItem } from 'app/model/es.model'

@Component({
  selector: 'app-variables-export-table',
  templateUrl: './variables-export-table.component.html',
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
  values: VariablesExportItem[] = [this.initNewItem()]
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
      scope: ScopeType.GLOBAL,
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
