import { Component, Input, OnInit } from '@angular/core'
import { DriverStatus, UiService } from 'app/api/service/ui.service'

@Component({
  selector: 'app-driver-status',
  templateUrl: './driver-status.component.html',
  styleUrls: ['./driver-status.component.css']
})
export class DriverStatusComponent implements OnInit {

  @Input() status: DriverStatus = {}

  constructor(
    private uiService: UiService,
  ) { }

  startAtStr() {
    if (this.status.commandStartAt) {
      return new Date(this.status.commandStartAt).toLocaleString()
    }
  }

  ngOnInit(): void {
  }

}
