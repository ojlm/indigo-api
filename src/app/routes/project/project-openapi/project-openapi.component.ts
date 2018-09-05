import { Location } from '@angular/common'
import { AfterViewInit, Component, ElementRef, HostListener, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { ActivatedRoute, Router } from '@angular/router'
import { MonacoService } from '@core/config/monaco.service'
import { NzMessageService } from 'ng-zorro-antd'
import { Subject } from 'rxjs'

import { GroupService } from '../../../api/service/group.service'
import { ProjectService } from '../../../api/service/project.service'
import { ApiRes } from '../../../model/api.model'
import { Project, UpdateDocResponse } from '../../../model/es.model'
import { PETSTORE_YAML } from './openapi-demo'

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

  KeySwaggerEditorContent = 'swagger-editor-content'
  SwaggerEditorDefaultContent = PETSTORE_YAML
  group: string
  project: string
  openapiEditorUrl: SafeResourceUrl
  submitting = false
  ifameHeight = `${window.innerHeight - 160}px`
  loading = true
  needSave = false
  editor: any
  spec = ''
  updateOpenapiSubject: Subject<Project> = new Subject<Project>()

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
    private sanitizer: DomSanitizer,
  ) {
    this.save = this.save.bind(this)
    const updateOpenapiResponseSubject = new Subject<ApiRes<UpdateDocResponse>>()
    updateOpenapiResponseSubject.subscribe(res => {
      this.needSave = false
      this.spec = this.editor.getState().getIn(['spec', 'spec'])
    })
    this.updateOpenapiSubject = this.projectService.newUpdateOpenapiSubject(updateOpenapiResponseSubject)
  }

  @HostListener('window:resize')
  _resize() {
    this.ifameHeight = `${window.innerHeight - 160}px`
  }

  reload() {
    this.loading = true
    this.projectService.getOpenApi(this.group, this.project).subscribe(res => {
      const project = res.data
      this.loading = false
      if (project && project.openapi) {
        this.spec = project.openapi
        this.setEditorValue(this.spec)
      }
    }, err => this.loading = false)
  }

  save() {
    const newValue = this.editor.getState().getIn(['spec', 'spec'])
    if (this.SwaggerEditorDefaultContent !== newValue && this.spec !== newValue) {
      this.needSave = true
      this.updateOpenapiSubject.next({ group: this.group, id: this.project, openapi: newValue })
    } else {
      this.needSave = false
    }
  }

  setEditorValue(value: string) {
    this.editor['specActions'].updateSpec(value)
  }

  ngOnInit(): void {
    // set swagger localstorage to prevent request petsore example yaml
    localStorage.setItem(this.KeySwaggerEditorContent, this.SwaggerEditorDefaultContent)
    this.route.paramMap.subscribe(param => {
      this.group = param.get('group')
      this.project = param.get('project')
      const editorUrl = '/openapi/editor'
      this.openapiEditorUrl = this.sanitizer.bypassSecurityTrustResourceUrl(editorUrl)
    })
  }

  ngAfterViewInit(): void {
    const iframe = this.el.nativeElement.getElementsByTagName('iframe')[0]
    const iWindow = iframe.contentWindow
    const timerId = window.setInterval((() => {
      const editor = iWindow['editor']
      if (editor) {
        this.editor = editor
        this.editor.getStore().subscribe(this.save)
        window.clearInterval(timerId)
        this.reload()
      }
    }).bind(this), 100)
  }
}
