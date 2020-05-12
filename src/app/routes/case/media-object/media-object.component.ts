import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { MonacoService } from '@core/config/monaco.service'

import { MediaObject } from '../../../model/es.model'
import { HttpContentTypes } from '../../../model/http.model'

@Component({
  selector: 'app-media-object',
  styles: ['.code-editor {height:360px;}'],
  templateUrl: './media-object.component.html',
})
export class MediaObjectComponent implements OnInit {

  contentType = HttpContentTypes.X_WWW_FORM_URLENCODED
  mediaObjects: { [key: string]: any } = {
    'application/x-www-form-urlencoded': []
  }

  @Input()
  get type() {
    return this.contentType
  }
  set type(val: string) {
    this.contentType = val || HttpContentTypes.X_WWW_FORM_URLENCODED
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
        if (HttpContentTypes.X_WWW_FORM_URLENCODED === obj.contentType) {
          try {
            this.mediaObjects[obj.contentType] = JSON.parse(obj.data)
          } catch (err) { }
        } else {
          this.mediaObjects[obj.contentType] = obj.data
        }
      })
    }
  }
  @Output()
  dataChange = new EventEmitter<MediaObject[]>()
  textEditorOptions = this.monocoService.getPlainTextOption()

  constructor(
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
