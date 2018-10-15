import { Component, Input, OnInit } from '@angular/core'
import { UserProfile } from 'app/model/user.model'

@Component({
  selector: 'app-profile-simple',
  templateUrl: './profile-simple.component.html',
})
export class PofileSimpleComponent implements OnInit {

  profile: UserProfile = {}
  @Input()
  set data(val: UserProfile) {
    if (val) {
      this.profile = val
    }
  }

  constructor() { }

  ngOnInit(): void {
  }
}
