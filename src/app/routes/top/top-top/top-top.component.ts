import { Component, ElementRef, HostListener, OnInit } from '@angular/core'
import { ExToptopGroupResponse, FavoriteService, QueryFavorite } from 'app/api/service/favorite.service'
import { Favorite } from 'app/model/es.model'
import { PageSingleModel } from 'app/model/page.model'

@Component({
  selector: 'app-top-top',
  templateUrl: './top-top.component.html',
  styleUrls: ['./top-top.component.css']
})
export class TopTopComponent extends PageSingleModel implements OnInit {

  height = `${window.innerHeight - 96}px`
  sideSubHeight = `${window.innerHeight - 96 - 36}px`
  query: QueryFavorite = {}
  items: ExToptopGroupResponse[] = []
  _item: any = {}
  @HostListener('window:resize')
  resize() {
    this.height = `${window.innerHeight - 96}px`
    this.sideSubHeight = `${window.innerHeight - 96 - 36}px`
  }

  constructor(
    private favoriteService: FavoriteService,
  ) {
    super()
  }

  clickItem(item: Favorite) {
    this._item = item
  }

  search() {
    this.favoriteService.query(this.query).subscribe(res => {
      this.items = res.data
    })
  }

  ngOnInit(): void {
    this.search()
  }
}
