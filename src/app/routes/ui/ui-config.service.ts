import { Injectable } from '@angular/core'
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class UiConfigService {

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
