import { Component, HostListener, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { ActivityService, RecommendProject, RecommendProjects } from 'app/api/service/activity.service'
import { ApiRes } from 'app/model/api.model'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  height = `${window.innerHeight - 48}px`
  my: RecommendProject[] = []
  others: RecommendProject[] = []
  wd = ''
  queryProjectSubject = new Subject<string>()
  @HostListener('window:resize')
  resize() {
    this.height = `${window.innerHeight - 48}px`
  }
  constructor(
    private activityService: ActivityService,
    private router: Router,
  ) {
    const response = new Subject<ApiRes<RecommendProjects>>()
    this.queryProjectSubject = this.activityService.recentSubject(response)
    response.subscribe(res => {
      this.my = res.data.my
    })
  }

  searchProject() {
    this.queryProjectSubject.next(this.wd)
  }

  goProject(item: RecommendProject) {
    this.router.navigateByUrl(`/${item.group}/${item.project}`)
  }

  ngOnInit() {
    this.activityService.recentWithOthers().subscribe(res => {
      this.my = res.data.my
      this.others = res.data.others
    })
  }
}
