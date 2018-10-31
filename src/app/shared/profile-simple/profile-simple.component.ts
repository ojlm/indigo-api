import { Component, Input, OnInit } from '@angular/core'
import { Router } from '@angular/router'
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

  constructor(
    private router: Router,
  ) { }

  goUserDashboard() {
    if (this.profile.username) {
      this.router.navigateByUrl(`/dashboard/${this.profile.username}`)
    }
  }

  ngOnInit(): void {
  }
}
