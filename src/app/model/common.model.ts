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
