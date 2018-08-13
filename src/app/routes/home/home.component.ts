import { Component, OnInit } from '@angular/core'
import { _HttpClient } from '@delon/theme'

@Component({
  selector: 'app-home',
  template: `
    <div class="content__title">
      <h1>Welcome To Indigo</h1>
    </div>
  `,
})
export class HomeComponent implements OnInit {

  constructor(
    private http: _HttpClient
  ) { }

  ngOnInit() {
  }

}
