import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { MonacoService } from '@core/config/monaco.service'
import { NzMessageService } from 'ng-zorro-antd'
import { DiffEditorModel } from 'ngx-monaco-editor'

import { GroupService } from '../../../api/service/group.service'
import { ProjectService } from '../../../api/service/project.service'

@Component({
  selector: 'app-project-openapi',
  templateUrl: './project-openapi.component.html',
})
export class ProjectOpenapiComponent implements OnInit {

  group: string
  project: string
  submitting = false

  editorOptions = this.monacoService.getJavascriptOption()
  code = 'function x() {\nconsole.log("Hello world!");\n}'
  options = {
    theme: 'vs-dark'
  }
  originalModel: DiffEditorModel = {
    code: 'heLLo world!',
    language: 'text/plain'
  }
  modifiedModel: DiffEditorModel = {
    code: 'hello orlando!',
    language: 'text/plain'
  }

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private projectService: ProjectService,
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private monacoService: MonacoService,
  ) { }


  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      this.group = param.get('group')
      this.project = param.get('project')
      console.log(this.group, this.project)
    })
  }
}
