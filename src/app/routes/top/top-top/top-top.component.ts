import { Component, HostListener, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ExToptopGroupResponse, FavoriteService } from 'app/api/service/favorite.service'
import { FavoriteType } from 'app/model/es.model'
import { PageSingleModel } from 'app/model/page.model'

@Component({
  selector: 'app-top-top',
  templateUrl: './top-top.component.html',
  styleUrls: ['./top-top.component.css']
})
export class TopTopComponent extends PageSingleModel implements OnInit {

  height = `${window.innerHeight - 48}px`
  items: ExToptopGroupResponse[] = []
  @HostListener('window:resize')
  resize() {
    this.height = `${window.innerHeight - 48}px`
  }

  constructor(
    private favoriteService: FavoriteService,
    private route: ActivatedRoute,
  ) {
    super()
  }

  activeChange(item: ExToptopGroupResponse) {
    if (!item.sub || item.sub.length === 0) {
      this.search(item.id)
    }
  }

  search(group: string, setActive = false) {
    if (group) {
      this.favoriteService.query({
        group: group,
        type: FavoriteType.TYPE_TOP_TOP,
        size: 1000,
        checked: 'true',
      }).subscribe(res => {
        this.items.filter(item => item.id === group).forEach(item => {
          item.sub = res.data.list
          if (setActive) item.active = true
        })
        this.items = [...this.items]
      })
    }
  }

  ngOnInit(): void {
    const params = this.route.firstChild.snapshot.params
    const group = params['topGroup']
    this.favoriteService.groupAggs().subscribe(res => {
      this.items = res.data
      if (this.items.length > 0) {
        this.search(group || this.items[0].id, true)
      }
    })
  }
}
