import { Location } from '@angular/common'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { MonacoService } from '@core/config/monaco.service'
import { NzMessageService } from 'ng-zorro-antd'

import { GroupService } from '../../../api/service/group.service'
import { ProjectService } from '../../../api/service/project.service'
import { MediaObject } from '../../../model/es.model'

@Component({
  selector: 'app-media-object',
  templateUrl: './media-object.component.html',
})
export class MediaObjectComponent implements OnInit {

  contentType: string
  mediaObjects: { [key: string]: string } = {}
  @Input()
  get type() {
    return this.contentType
  }
  set type(val: string) {
    this.contentType = val
  }
  @Output()
  typeChange = new EventEmitter<string>()
  @Input()
  set data(objs: MediaObject[]) {

  }
  @Output()
  dataChange = new EventEmitter<MediaObject[]>()
  jsonEditorOptions = this.monocoService.getJsonOption()
  textEditorOptions = this.monocoService.getPlainTextOption()

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private projectService: ProjectService,
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private monocoService: MonacoService,
  ) { }

  contentTypeChange() {
    this.typeChange.emit(this.contentType)
  }

  ngOnInit(): void {
  }
}
