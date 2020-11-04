import { Component, Input, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { MemberRoleItem, PermissionsService, QueryPermissions, UserRoles } from 'app/api/service/permissions.service'
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
  FULL_ROLES: NameValue[] = this.permissionsService.FULL_ROLES

  form: FormGroup
  submitting = false

  members: PermissionsEx[] = []
  membersLoading = false
  query: QueryPermissions = {}
  querySubject = new Subject<QueryPermissions>()
  profiles: { [k: string]: UserProfile } = {}

  canEdit = false
  myRoles: UserRoles = {}

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private permissionsService: PermissionsService,
    private router: Router,
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

  itemChange(item: PermissionsEx) {
    const tmp = { ...item }
    delete tmp._id
    delete tmp.canEdit
    delete tmp.roles
    delete tmp.createdAt
    delete tmp.creator
    delete tmp.updatedAt
    if (item.type === this.permissionsService.TYPE_GROUP) {
      this.permissionsService.updateGroup(item.group, item._id, tmp).subscribe(_ => this.loadMembers())
    } else if (item.type === this.permissionsService.TYPE_PROJECT) {
      this.permissionsService.updateProject(item.group, item.project, item._id, tmp).subscribe(_ => this.loadMembers())
    }
  }

  remove(item: Permissions) {
    if (item.type === this.permissionsService.TYPE_GROUP) {
      this.permissionsService.deleteGroup(item.group, item._id).subscribe(_ => this.loadMembers())
    } else if (item.type === this.permissionsService.TYPE_PROJECT) {
      this.permissionsService.deleteProject(item.group, item.project, item._id).subscribe(_ => this.loadMembers())
    }
  }

  linkText(item: Permissions) {
    if (item.type === 'group') {
      return item.group
    } else {
      return `${item.group}/${item.project}`
    }
  }

  linkClick(item: Permissions) {
    if (item.type === 'group') {
      this.router.navigateByUrl(`/${item.group}`)
    } else {
      this.router.navigateByUrl(`/${item.group}/${item.project}`)
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
    this.permissionsService.roles().subscribe(resRoles => {
      this.myRoles = resRoles.data
      this.canEdit = this.permissionsService.isMaintainer(this.group, this.project, this.myRoles)
      this.roles = this.permissionsService.getRoleOptions(this.group, this.project, this.myRoles)
      const permissionResponse = new Subject<ApiRes<Permissions[]>>()
      if (this.group && this.project) {
        this.querySubject = this.permissionsService.newQueryProjectSubject(this.group, this.project, permissionResponse)
      } else if (this.group) {
        this.querySubject = this.permissionsService.newQueryGroupSubject(this.group, permissionResponse)
      }
      permissionResponse.subscribe(resMembers => {
        let groupRole: MemberRoleItem
        if (this.group && this.myRoles.groups[this.group]) {
          groupRole = this.myRoles.groups[this.group]
        }
        let projectRole: MemberRoleItem
        if (this.project && this.myRoles.projects[this.project]) {
          projectRole = this.myRoles.projects[this.project]
        }
        this.members = resMembers.data.list.map(item => this.toMemberEx(item, groupRole, projectRole))
        this.pageTotal = resMembers.data.total
        this.profiles = resMembers.data['profiles'] || {}
        this.membersLoading = false
      }, _ => this.membersLoading = false)
      this.loadMembers()
      const userResponse = new Subject<ApiRes<UserProfile[]>>()
      this.userQuerySubject = this.userService.newQuerySubject(userResponse)
      userResponse.subscribe(res => {
        this.isUserSearchLoading = false
        this.users = res.data.list
      }, _ => this.isUserSearchLoading = false)
    })
  }

  toMemberEx(item: Permissions, groupRole: MemberRoleItem, projectRole: MemberRoleItem): PermissionsEx {
    let canEdit = false
    if (this.myRoles.isAdmin) {
      canEdit = true
    } else {
      if (!this.project) { // project members
        if (groupRole && this.permissionsService.RoleScores[groupRole.role] >= this.permissionsService.RoleScores[item.role]) {
          canEdit = true
        } else if (projectRole && this.permissionsService.RoleScores[projectRole.role] >= this.permissionsService.RoleScores[item.role]) {
          canEdit = true
        }
      } else { // group members
        if (groupRole && this.permissionsService.RoleScores[groupRole.role] >= this.permissionsService.RoleScores[item.role]) {
          canEdit = true
        }
      }
    }
    return {
      ...item, canEdit,
      roles: item.type === this.permissionsService.TYPE_GROUP ? this.FULL_ROLES : this.permissionsService.BASIC_ROLES
    }
  }
}

export interface PermissionsEx extends Permissions {
  canEdit?: boolean
  roles?: NameValue[]
}
