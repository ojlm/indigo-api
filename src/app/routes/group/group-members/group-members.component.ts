import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-group-members',
  templateUrl: './group-members.component.html',
})
export class GroupMembersComponent implements OnInit {

  group = ''

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      this.group = param.get('group')
    })
  }
}
