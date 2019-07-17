export interface SelectModel {
  label?: string
  value?: string
  desc?: string
}

export interface SelectResponse {
  code?: string
  msg?: string
  data?: SelectModel[]
}

export interface NameValue {
  name?: string
  value?: any
  extra?: any
  series?: NameValue[]
}
