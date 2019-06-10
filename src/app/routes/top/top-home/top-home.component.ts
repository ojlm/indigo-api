import { Component, OnInit } from '@angular/core'
import { FavoriteService } from 'app/api/service/favorite.service'

@Component({
  selector: 'app-top-home',
  templateUrl: './top-home.component.html',
})
export class TopHomeComponent implements OnInit {

  constructor(
    private favoriteService: FavoriteService,
  ) { }

  ngOnInit(): void {
  }
}
