import { Component, HostListener, Input, OnInit } from '@angular/core'
import { MonacoService } from '@core/config/monaco.service'
import { ExtraData } from 'app/model/es.model'

@Component({
  selector: 'app-monaco-editor',
  templateUrl: './monaco-editor.component.html',
  styleUrls: ['./monaco-editor.component.css']
})
export class MonacoEditorComponent implements OnInit {

  scriptEditorHeight = `${window.innerHeight}px`
  javascriptEditorOption = this.monocoService.getJavascriptOption(false)
  @Input() data: ExtraData = {}
  @HostListener('window:resize')
  resizeBy() {
    this.scriptEditorHeight = `${window.innerHeight}px`
  }
  constructor(
    private monocoService: MonacoService,
  ) { }

  ngOnInit(): void {
  }
}
