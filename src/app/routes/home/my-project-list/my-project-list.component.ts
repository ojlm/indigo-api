import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { ActivityService, RecommendProject } from 'app/api/service/activity.service'
import { ProjectService } from 'app/api/service/project.service'

import { GroupService } from '../../../api/service/group.service'
import { Group } from '../../../model/es.model'
import { PageSingleModel } from '../../../model/page.model'

@Component({
  selector: 'app-my-project-list',
  templateUrl: './my-project-list.component.html',
  styleUrls: ['./my-project-list.component.css']
})
export class MyProjectListComponent extends PageSingleModel implements OnInit {

  my: RecommendProjectEx[] = []

  constructor(
    private activityService: ActivityService,
    private projectService: ProjectService,
    private groupService: GroupService,
    private router: Router,
  ) {
    super()
  }

  groupText(item: RecommendProjectEx) {
    return item._group ? this.groupService.getBreadcrumb(item._group) : item.group
  }

  projectText(item: RecommendProjectEx) {
    return item.summary || item.project
  }

  goProject(item: RecommendProject) {
    this.router.navigateByUrl(`/${item.group}/${item.project}`)
  }

  loadData() {
  }

  ngOnInit() {
    this.activityService.recentWithoutOthers().subscribe(res => {
      this.my = fillGroupData(res.data.my, res.data.groups)
    })
  }
}

function fillGroupData(items: RecommendProject[], groups: { [k: string]: Group }) {
  if (items && groups) {
    items.forEach(item => (item as RecommendProjectEx)._group = groups[item.group])
  }
  return items as RecommendProjectEx[]
}

interface RecommendProjectEx extends RecommendProject {
  _group?: Group
}
