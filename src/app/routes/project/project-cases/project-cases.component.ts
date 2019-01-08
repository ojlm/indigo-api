import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { DeleteItemComponent } from '@shared/delete-item/delete-item.component'
import { GroupProjectSelectorModel } from '@shared/group-project-selector/group-project-selector.component'
import { ApiRes } from 'app/model/api.model'
import { UserProfile } from 'app/model/user.model'
import { calcDrawerWidth } from 'app/util/drawer'
import { NzDrawerService, NzMessageService } from 'ng-zorro-antd'
import { Subject } from 'rxjs'

import { CaseService, QueryCase } from '../../../api/service/case.service'
import { Case } from '../../../model/es.model'
import { PageSingleModel } from '../../../model/page.model'

@Component({
  selector: 'app-project-cases',
  templateUrl: './project-cases.component.html',
  styles: [`
    .user-info {
      float: right;
      opacity: 0.5;
    }
    .user-info:hover {
      float: right;
      opacity: 1;
    }
    .divider-text {
      font-size: small;
      color: gray;
    }
  `]
})
export class ProjectCasesComponent extends PageSingleModel implements OnInit {

  drawerWidth = calcDrawerWidth(0.45)
  allSelected = false
  selectable = false
  batchMode = false
  selectedItems: ExCase[] = []
  batchLabel = ''
  form: FormGroup
  items: ExCase[] = []
  users: { [k: string]: UserProfile } = {}
  loading = false
  group: string
  project: string
  search: QueryCase = {}
  panelSubject: Subject<QueryCase> = new Subject<QueryCase>()
  querySubject: Subject<QueryCase>
  transferGroupProject: GroupProjectSelectorModel = {}

  constructor(
    private caseService: CaseService,
    private msgService: NzMessageService,
    private drawerService: NzDrawerService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) {
    super()
    const response = new Subject<ApiRes<Case[]>>()
    this.querySubject = this.caseService.newQuerySubject(response)
    response.subscribe(res => {
      this.allSelected = false
      this.loading = false
      if (res) {
        this.items = res.data.list
        this.pageTotal = res.data.total
        const newUser = res.data['creators'] || {}
        for (const k of Object.keys(newUser)) {
          this.users[k] = newUser[k]
        }
      }
    })
    this.panelSubject.subscribe(search => {
      this.loadData()
    })
  }

  batchOperationBtnClick() {
    this.batchMode = true
  }

  resetSeleableState() {
    this.allSelected = false
    this.selectable = false
    this.batchLabel = ''
    this.selectedItems = []
    this.batchMode = false
  }

  clearSelectedItems() {
    this.selectedItems = []
    this.batchMode = false
    this.items.forEach(item => item._checked = false)
  }

  batchTransfer() {
    const reqBody = { ...this.transferGroupProject, ids: this.selectedItems.map(item => item._id) }
    this.caseService.batchTransfer(reqBody)
      .subscribe(res => {
        this.loadData()
        this.resetSeleableState()
      })
  }

  batchAddLabel() {
    if (this.selectedItems.length > 0 && this.batchLabel) {
      const labelItems = this.selectedItems.map(item => {
        return {
          id: item._id,
          labels: [...(item.labels || []), { name: this.batchLabel }]
        }
      })
      if (labelItems.length > 0) {
        this.caseService.batchOperateLabels({ labels: labelItems }).subscribe(res => {
          this.loadData()
          this.resetSeleableState()
        })
      }
    }
  }

  batchDeleteLabel() {
    if (this.selectedItems.length > 0 && this.batchLabel) {
      const labelItems = []
      this.selectedItems.forEach(item => {
        if (item.labels && item.labels.length > 0) {
          const newLables = item.labels.filter(label => label.name !== this.batchLabel)
          if (newLables.length !== item.labels.length) {
            labelItems.push({ id: item._id, labels: newLables })
          }
        }
      })
      if (labelItems.length > 0) {
        this.caseService.batchOperateLabels({ labels: labelItems }).subscribe(res => {
          this.loadData()
          this.resetSeleableState()
        })
      }
    }
  }

  refreshSelectedItems(checked: boolean, index: number) {
    const item = this.items[index]
    if (checked) {
      this.selectedItems.push(item)
    } else {
      const delIndex = this.selectedItems.findIndex(_item => _item._id === item._id)
      this.selectedItems.splice(delIndex, 1)
    }
    this.selectedItems = [...this.selectedItems]
  }

  selectAll() {
    if (this.allSelected) {
      this.items.forEach(item => item._checked = false)
      this.selectedItems = []
    } else {
      this.items.forEach(item => item._checked = true)
      this.selectedItems = [...this.items]
    }
    this.allSelected = !this.allSelected
  }

  loadData() {
    if (this.group && this.project) {
      this.loading = true
      this.allSelected = false
      this.querySubject.next({ group: this.group, project: this.project, ...this.toPageQuery(), ...this.search, hasCreators: true })
    }
  }

  methodTagColor(item: Case) {
    switch (item.request.method) {
      case 'GET':
        return 'green'
      case 'DELETE':
        return 'red'
      case 'POST':
        return 'cyan'
      case 'PUT':
        return 'blue'
      default:
        return 'purple'
    }
  }

  userText(item: Case) {
    const profile = this.users[item.creator]
    if (profile) {
      return (profile.nickname || profile.username)[0]
    } else {
      return ''
    }
  }

  userAvatar(item: Case) {
    const profile = this.users[item.creator]
    if (profile) {
      return profile.avatar
    } else {
      return ''
    }
  }

  getRouter(item: Case) {
    return `/case/${this.group}/${this.project}/${item._id}`
  }

  editOrCheckItem(item: ExCase, forceNav: boolean = false) {
    if (forceNav) {
      this.router.navigateByUrl(this.getRouter(item))
    } else {
      if (this.selectable) {
        item._checked = !item._checked
        if (item._checked) {
          this.selectedItems.push(item)
        } else {
          const delIndex = this.selectedItems.findIndex(_item => _item._id === item._id)
          this.selectedItems.splice(delIndex, 1)
        }
        this.selectedItems = [...this.selectedItems]
      } else {
        this.router.navigateByUrl(this.getRouter(item))
      }
    }
  }

  deleteItem(item: Case) {
    const drawerRef = this.drawerService.create({
      nzTitle: item.summary,
      nzContent: DeleteItemComponent,
      nzContentParams: {
        data: {
          type: 'case',
          value: item
        }
      },
      nzBodyStyle: {
        'padding': '8px'
      },
      nzWidth: calcDrawerWidth(0.33)
    })
    drawerRef.afterClose.subscribe(data => {
      if (data) {
        this.loadData()
      }
    })
  }

  pageChange() {
    this.loadData()
  }

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.group = params['group']
      this.transferGroupProject.group = this.group
      this.project = params['project']
      this.loadData()
    })
  }
}

interface ExCase extends Case {
  id?: string
  _checked?: boolean
}
