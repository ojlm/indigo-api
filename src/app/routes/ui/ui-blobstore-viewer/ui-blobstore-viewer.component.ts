import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core'
import { BlobService } from 'app/api/service/blob.service'
import { BlobMetaData } from 'app/model/es.model'

import { LogEntry } from '../ui.model'

@Component({
  selector: 'app-ui-blobstore-viewer',
  templateUrl: './ui-blobstore-viewer.component.html',
  styleUrls: ['./ui-blobstore-viewer.component.css']
})
export class UiBlobstoreViewerComponent implements OnInit, AfterViewInit {

  @Input() item: LogEntry
  @ViewChild('img') img: ElementRef

  constructor(
    private blobService: BlobService,
  ) { }

  ngAfterViewInit(): void {
    if (this.img && this.item && this.item.data && this.item.data.params && this.item.data.params.store) {
      const store: BlobMetaData = this.item.data.params.store
      this.blobService.readAsBytes(this.item.group, this.item.project, store.key, store.engine).subscribe(res => {
        this.img.nativeElement.src = `data:image/png;base64, ${res.data}`
      })
    }
  }

  ngOnInit(): void {
  }

}
