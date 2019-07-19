import { Component, Input, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-ci-event',
  templateUrl: './ci-event.component.html',
  styles: []
})
export class CiEventComponent implements OnInit {

  @Input() group = ''
  @Input() project = ''

  constructor(
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
  }
}
