export const HttpContentTypes = {
  JSON: 'application/json',
  X_WWW_FORM_URLENCODED: 'application/x-www-form-urlencoded',
  TEXT_PLAIN: 'text/plain',
  MULTIPART_FORM_DATA: 'multipart/form-data',

  isNeedTransform(contentType: string) {
    return HttpContentTypes.X_WWW_FORM_URLENCODED === contentType || HttpContentTypes.MULTIPART_FORM_DATA === contentType
  }
}
