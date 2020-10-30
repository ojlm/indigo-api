import { Component, Input, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { PermissionsService, QueryPermissions } from 'app/api/service/permissions.service'
import { QueryUser, UserService } from 'app/api/service/user.service'
import { ApiRes } from 'app/model/api.model'
import { NameValue } from 'app/model/common.model'
import { Permissions } from 'app/model/es.model'
import { PageSingleModel } from 'app/model/page.model'
import { UserProfile } from 'app/model/user.model'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-permission-members',
  templateUrl: './permission-members.component.html',
})
export class PermissionMembersComponent extends PageSingleModel implements OnInit {

  @Input() group = ''
  @Input() project = ''

  isUserSearchLoading = false
  userQuerySubject: Subject<QueryUser>
  users: UserProfile[] = []
  roles: NameValue[] = this.permissionsService.BASIC_ROLES

  form: FormGroup
  submitting = false

  members: Permissions[] = []
  membersLoading = false
  query: QueryPermissions = {}
  querySubject = new Subject<QueryPermissions>()
  profiles: { [k: string]: UserProfile } = {}

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private permissionsService: PermissionsService,
  ) {
    super()
    this.form = this.fb.group({
      user: [null, [Validators.required]],
      role: [this.permissionsService.BASIC_ROLES[0].value, [Validators.required]],
    })
  }

  submit() {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty()
      this.form.controls[i].updateValueAndValidity()
    }
    if (this.form.invalid) return
    const value = this.form.value
    this.submitting = true
    const req = { username: value.user.username, role: value.role }
    if (this.group && this.project) {
      this.permissionsService.indexProject(this.group, this.project, req).subscribe(_ => {
        this.submitting = false
        this.loadMembers()
      }, _ => this.submitting = false)
    } else if (this.group) {
      this.permissionsService.indexGroup(this.group, req).subscribe(_ => {
        this.submitting = false
        this.loadMembers()
      }, _ => this.submitting = false)
    }
  }

  profileText(item: Permissions) {
    const profile = this.profiles[item.username]
    if (profile) {
      return this.userService.getAvatarText(profile)
    } else {
      return ''
    }
  }

  profileAvatar(item: Permissions) {
    const profile = this.profiles[item.username]
    if (profile) {
      return profile.avatar
    } else {
      return ''
    }
  }

  profileName(item: Permissions) {
    const profile = this.profiles[item.username]
    if (profile) {
      return profile.nickname || profile.username
    } else {
      return ''
    }
  }

  roleText(item: Permissions) {
    return this.permissionsService.getRoleText(item.role)
  }

  loadMembers() {
    this.membersLoading = true
    this.querySubject.next({ ...this.toPageQuery(), ...this.query })
  }

  pageChange() {
    this.loadMembers()
  }

  userLabel(item: UserProfile) {
    return this.userService.getUserLabel(item)
  }

  userAvatarText(item: UserProfile) {
    return this.userService.getAvatarText(item)
  }

  searchUser(text: string) {
    this.isUserSearchLoading = true
    this.userQuerySubject.next({ text: text })
  }

  ngOnInit(): void {
    // TODO: get current user roles
    // this.permissionsService.getRoleOptions('')
    const permissionResponse = new Subject<ApiRes<Permissions[]>>()
    if (this.group && this.project) {
      this.querySubject = this.permissionsService.newQueryProjectSubject(this.group, this.project, permissionResponse)
    } else if (this.group) {
      this.querySubject = this.permissionsService.newQueryGroupSubject(this.group, permissionResponse)
    }
    permissionResponse.subscribe(res => {
      this.members = res.data.list
      this.pageTotal = res.data.total
      this.profiles = res.data['profiles'] || {}
      this.membersLoading = false
    }, _ => this.membersLoading = false)
    this.loadMembers()
    const userResponse = new Subject<ApiRes<UserProfile[]>>()
    this.userQuerySubject = this.userService.newQuerySubject(userResponse)
    userResponse.subscribe(res => {
      this.isUserSearchLoading = false
      this.users = res.data.list
    }, _ => this.isUserSearchLoading = false)
  }
}
