import { Component, Input, OnInit } from '@angular/core'
import { DriverStatus } from 'app/api/service/ui.service'

@Component({
  selector: 'app-driver-status',
  templateUrl: './driver-status.component.html',
  styleUrls: ['./driver-status.component.css']
})
export class DriverStatusComponent implements OnInit {

  @Input() status: DriverStatus = {}

  constructor() { }

  ngOnInit(): void {
  }

}
