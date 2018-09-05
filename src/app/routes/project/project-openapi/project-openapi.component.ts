import { Location } from '@angular/common'
import { AfterViewInit, Component, ElementRef, HostListener, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { MonacoService } from '@core/config/monaco.service'
import { NzMessageService } from 'ng-zorro-antd'

import { GroupService } from '../../../api/service/group.service'
import { ProjectService } from '../../../api/service/project.service'

@Component({
  selector: 'app-project-openapi',
  templateUrl: './project-openapi.component.html',
  styles: [`
    .openapi-ifame {
      width: 100%;
    }
  `]
})
export class ProjectOpenapiComponent implements OnInit, AfterViewInit {

  group: string
  project: string
  submitting = false
  ifameHeight = `${window.outerHeight - 50}px`
  loading = true
  editor: any
  spec = ''

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private projectService: ProjectService,
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private monacoService: MonacoService,
    private el: ElementRef<HTMLElement>,
  ) { }

  @HostListener('window:resize')
  _resize() {
    this.ifameHeight = `${window.outerHeight - 50}px`
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      this.group = param.get('group')
      this.project = param.get('project')
      console.log(this.group, this.project)
    })
  }

  setEditorValue(value: string) {
    this.editor['specActions'].updateSpec(value)
  }

  handleEditorValueChange() {
    const newValue = this.editor.getState().getIn(['spec', 'spec'])
    console.log(newValue)
  }

  ngAfterViewInit(): void {
    const iframe = this.el.nativeElement.getElementsByTagName('iframe')[0]
    const iWindow = iframe.contentWindow
    const timerId = window.setInterval((() => {
      const editor = iWindow['editor']
      if (editor) {
        this.loading = false
        this.editor = editor
        this.editor.getStore().subscribe(this.handleEditorValueChange.bind(this))
        window.clearInterval(timerId)
      }
    }).bind(this), 100)
  }
}
