import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-project-breadcrumb',
  templateUrl: './project-breadcrumb.component.html',
})
export class ProjectBreadcrumbComponent implements OnInit {

  group: string
  project: string

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.group = params['group']
      this.project = params['project']
    })
  }
}
