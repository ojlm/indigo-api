import { Component, OnInit } from '@angular/core'
import { FavoriteService } from 'app/api/service/favorite.service'
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-top-content',
  templateUrl: './top-content.component.html',
})
export class TopContentComponent implements OnInit {

  constructor(
    private favoriteService: FavoriteService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const topId = params['topId']
      if (topId) {
        console.log(topId)
      }
    })
  }
}
