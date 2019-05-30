import { Component, HostListener, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  @HostListener('window:resize')
  resize() {
  }
  constructor(
    private router: Router,
  ) {
  }

  ngOnInit() {
  }
}
