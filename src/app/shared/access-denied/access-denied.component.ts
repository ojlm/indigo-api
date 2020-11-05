import { Component, Input, OnInit } from '@angular/core'
import { Maintainers } from 'app/api/service/permissions.service'

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.css']
})
export class AccessDeniedComponent implements OnInit {

  @Input() maintainers: Maintainers = {}

  constructor() { }

  hasMaintainer() {
    if (this.maintainers.groups && this.maintainers.groups.length > 0 ||
      this.maintainers.projects && this.maintainers.projects.length > 0) {
      return true
    } else {
      return false
    }
  }

  ngOnInit(): void {
  }
}
