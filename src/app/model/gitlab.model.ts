export interface GitNamespace {
  path?: string
}
export interface GitProject {
  id?: number
  name?: string
  description?: string
  default_branch?: string
  public?: boolean
  visibility?: string
  ssh_url_to_repo?: string
  http_url_to_repo?: string
  web_url?: string
  avatar_url?: string
  namespace?: GitNamespace
}

export interface GitGroup {
  id?: number
  name?: string
  path?: string
  description?: string
  avatar_url?: string
  full_name?: string
  full_path?: string
  lfs_enabled?: boolean
  projects?: GitProject[]
  statistics?: any
  request_access_enabled?: boolean
  visibility?: any
  web_url?: string
}
