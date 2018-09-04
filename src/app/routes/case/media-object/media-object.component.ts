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
  styles: ['.code-editor {height:360px;}'],
  templateUrl: './media-object.component.html',
})
export class MediaObjectComponent implements OnInit {

  contentType: string
  mediaObjects: { [key: string]: any } = {
    'application/x-www-form-urlencoded': []
  }

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
  get data() {
    const mos: MediaObject[] = []
    for (const k in this.mediaObjects) {
      mos.push({ contentType: k, data: this.mediaObjects[k] })
    }
    return mos
  }
  set data(objs: MediaObject[]) {
    if (objs && objs.length > 0) {
      objs.forEach(obj => {
        this.mediaObjects[obj.contentType] = obj.data
      })
    }
  }
  @Output()
  dataChange = new EventEmitter<MediaObject[]>()
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
  modelChange() {
    this.dataChange.emit(this.data)
  }
  ngOnInit(): void {
  }
}
