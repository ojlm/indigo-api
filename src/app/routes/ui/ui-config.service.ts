import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class UiConfigService {

  menuCollapsedSubject = new Subject<boolean>()

  constructor(
    private router: Router,
  ) { }

  goFiles(group: string, project: string) {
    this.router.navigateByUrl(`/ui/${group}/${project}/files`)
  }

  goFile(group: string, project: string, id: string) {
    this.router.navigateByUrl(`/ui/${group}/${project}/file/${id}`)
  }

}
