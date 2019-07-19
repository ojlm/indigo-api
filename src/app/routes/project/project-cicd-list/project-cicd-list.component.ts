import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'

import { PageSingleModel } from '../../../model/page.model'

@Component({
  selector: 'app-project-cicd-list',
  templateUrl: './project-cicd-list.component.html',
})
export class ProjectCiCdListComponent extends PageSingleModel implements OnInit {

  loading = false
  group: string
  project: string

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
    super()
  }

  loadData() {
    if (this.group && this.project) {
      this.loading = true
    }
  }

  pageChange() {
    this.loadData()
  }

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.group = params['group']
      this.project = params['project']
      this.loadData()
    })
  }
}
