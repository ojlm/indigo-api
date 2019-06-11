import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { FavoriteService } from 'app/api/service/favorite.service'

@Component({
  selector: 'app-top-content',
  templateUrl: './top-content.component.html',
})
export class TopContentComponent implements OnInit {

  constructor(
    private favoriteService: FavoriteService,
    private route: ActivatedRoute,
  ) { }

  loadById(group: string, project: string, id: string) {
    this.favoriteService.getToptop(group, project, id).subscribe(res => {

    })
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const topGroup = params['topGroup']
      const topProject = params['topProject']
      const topId = params['topId']
      if (topGroup && topProject && topId) { this.loadById(topGroup, topProject, topId) }
    })
  }
}
