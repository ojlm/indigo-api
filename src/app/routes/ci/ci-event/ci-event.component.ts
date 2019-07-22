import { Component, Input, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { CiTrigger } from 'app/model/es.model'

@Component({
  selector: 'app-ci-event',
  templateUrl: './ci-event.component.html',
  styles: []
})
export class CiEventComponent implements OnInit {

  @Input() group = ''
  @Input() project = ''
  isSending = false
  isSaved = true
  request: CiTrigger = {
    readiness: {
      enabled: false,
      delay: 30,
      interval: 10,
      timeout: 1,
      retries: 3,
    }
  }

  constructor(
    private route: ActivatedRoute,
  ) {
  }

  save() {
    console.log(this.request)
  }

  select() {

  }

  modelChange() {
    this.isSaved = false
  }

  ngOnInit(): void {
  }
}
