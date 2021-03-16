export function syntaxHighlight(json: string | Object, newWindow = true) {
  let data: string
  if (typeof json !== 'string') {
    data = JSON.stringify(json, undefined, 2)
  }
  let result = data.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  // tslint:disable-next-line:max-line-length
  result = result.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    let cls = 'number'
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key'
        return `<span class="${cls}" style="color: red;">${match}</span>`
      } else {
        cls = 'string'
        return `<span class="${cls}" style="color: green;">${match}</span>`
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean'
      return `<span class="${cls}" style="color: blue;">${match}</span>`
    } else if (/null/.test(match)) {
      cls = 'null'
      return `<span class="${cls}" style="color: magenta;">${match}</span>`
    }
    return `<span class="${cls}" style="color: darkorange;">${match}</span>`
  })
  const blob = new Blob([data], { type: 'text/plain' })
  const href = window.URL.createObjectURL(blob)
  const html = `
            <div style="overflow: scroll;">
                <pre style="outline: 1px solid #ccc;padding: 5px;margin: 5px;">${result}</pre>
            <body>
        `
  if (newWindow) {
    const width = window.screen.availWidth / 2
    const height = window.screen.availHeight / 2
    const w = window.open('json', '_blank', `width=${width},height=${height},left=${width / 2},top=${height / 2}`)
    w.document.write(html)
  } else {
    return html
  }
}

export function formatJson(val: any, num = 4) {
  if (!val) return
  const a = []
  for (let i = 0; i < num; ++i) {
    a.push(' ')
  }
  try {
    if (typeof val === 'string') {
      return JSON.stringify(JSON.parse(val), null, a.join(''))
    } else {
      return JSON.stringify(val, null, a.join(''))
    }
  } catch (error) {
    return val
  }
}
