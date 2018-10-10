import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { DtabItem, LinkerdService } from 'app/api/service/linkerd.service'

@Component({
  selector: 'app-linkerd-http',
  templateUrl: './linkerd-http.component.html',
})
export class LinkerdHttpComponent implements OnInit {

  items: DtabItem[] = []
  group: string
  project: string

  constructor(
    private linkerdService: LinkerdService,
    private route: ActivatedRoute,
  ) { }

  loadData() {
    if (this.group && this.project) {
      this.linkerdService.getV1Http(this.group, this.project).subscribe(res => {
        this.items = res.data
      })
    }
  }

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.group = params['group']
      this.project = params['project']
      this.loadData()
    })
  }
}
