import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

import { Group, Project } from '../../model/es.model'
import { BaseService } from './base.service'

@Injectable({
  providedIn: 'root'
})
export class SharedService extends BaseService {

  currentGroup = new Subject<Group>()
  currentProject = new Subject<Project>()
}
