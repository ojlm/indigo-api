import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { I18NService } from '@core'
import { BlobService } from 'app/api/service/blob.service'
import { ApiRes } from 'app/model/api.model'
import { NzMessageService, UploadFile } from 'ng-zorro-antd'
import { UploadChangeParam } from 'ng-zorro-antd/upload'
import { Options } from 'sortablejs'

import { BlobMetaData, FormDataItem } from '../../model/es.model'

@Component({
  selector: 'app-form-data-item',
  templateUrl: './form-data-item.component.html',
})
export class FormDataItemComponent implements OnInit {

  UPLOAD_BLOB_ACTION = ''

  sortablejsOptions: Options = {
    handle: '.anticon-bars',
    onUpdate: function (event: any) {
      this.dataChange.emit(this.data)
    }.bind(this)
  }
  values: FormDataItem[] = []
  files: FormDataFileItem[] = []
  holder = { group: '', project: '' }
  @Input()
  set group(val: string) {
    this.holder.group = val
    this.updateUrl()
  }
  @Input()
  set project(val: string) {
    this.holder.project = val
    this.updateUrl()
  }
  @Input()
  get data() {
    return this.values.filter(item => Object.keys(item).length > 0)
  }
  set data(val: FormDataItem[]) {
    if (!val) val = []
    this.values = [...val, {}]
    this.files = this.values.map(item => this.newFileItem(item))
  }
  @Output()
  dataChange = new EventEmitter<FormDataItem[]>()
  @Input() hasCheckbox = true

  constructor(
    private blobService: BlobService,
    private msgService: NzMessageService,
    private i18nService: I18NService,
  ) { }

  updateUrl() {
    if (this.holder.group && this.holder.project) {
      this.UPLOAD_BLOB_ACTION = this.blobService.getUploadUrl(this.holder.group, this.holder.project)
    }
  }

  downloadItem(item: FormDataItem) {
    if (this.holder.group && this.holder.project) {
      return this.blobService.downloadBlob(this.holder.group, this.holder.project, item.value, item.metaData.fileName)
    }
  }

  removeFile(fileItem: FormDataFileItem) {
    fileItem.data.value = ''
    fileItem.data.metaData = null
    fileItem.showButton = true
  }

  newFileItem(item: FormDataItem) {
    const fileItem: FormDataFileItem = {
      uploading: false,
      showButton: item.value ? false : true,
      data: item,
      fileList: [],
    }
    // fileItem.beforeUpload = (file: UploadFile): boolean => {
    //   fileItem.fileList = [file]
    //   this.handleUpload(fileItem)
    //   return false
    // }
    fileItem.handleChange = (info: UploadChangeParam): void => {
      switch (info.type) {
        case 'start':
          fileItem.showButton = false
          fileItem.uploading = true
          break
        case 'progress':
          fileItem.percent = info.event.percent
          break
        case 'success':
          const res = info.file.response as ApiRes<BlobMetaData>
          fileItem.uploading = false
          fileItem.percent = 0
          fileItem.fileList = []
          fileItem.showButton = false
          fileItem.data.value = res.data.key
          fileItem.data.metaData = res.data
          this.dataChange.emit(this.data)
          break
        case 'error':
          fileItem.uploading = false
          fileItem.percent = 0
          fileItem.fileList = []
          fileItem.showButton = true
          this.msgService.error(this.i18nService.fanyi('tips-upload-error'))
          break
      }
    }
    return fileItem
  }

  // handleUpload(fileItem: FormDataFileItem) {
  //   const formData = new FormData()
  //   if (fileItem.fileList && fileItem.fileList.length > 0) {
  //     formData.append('file', fileItem.fileList[0] as any)
  //   } else {
  //     return
  //   }
  //   fileItem.uploading = true
  //   this.blobService.uploadBlob(formData)
  //     .subscribe(
  //       (res) => {
  //         fileItem.uploading = false
  //         fileItem.fileList = []
  //         fileItem.showButton = false
  //         fileItem.data.value = res.data.key
  //         fileItem.data.metaData = res.data
  //         this.dataChange.emit(this.data)
  //       },
  //       () => {
  //         fileItem.uploading = false
  //         fileItem.fileList = []
  //       }
  //     )
  // }

  modelChange(item: FormDataItem, index: number) {
    if (item.enabled === undefined) {
      item.enabled = true
    }
    if (index === this.values.length - 1) {
      this.values.push({})
      this.values = [...this.values]
    }
    this.dataChange.emit(this.data)
  }

  remove(index: number) {
    if (index === this.data.length) return
    if (this.data.length > 0) {
      this.values.splice(index, 1)
      this.values = [...this.values]
      this.dataChange.emit(this.data)
    } else {
      this.values = []
      this.dataChange.emit(this.data)
    }
  }

  ngOnInit(): void {
  }
}

export interface FormDataFileItem {
  uploading: boolean
  showButton: boolean
  percent?: number
  fileList: UploadFile[]
  data: FormDataItem
  beforeUpload?: Function
  handleChange?: Function
}
