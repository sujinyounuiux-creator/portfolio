// Builds the downloadable résumé with real text and clickable links, from
// scripts/resume.html, using headless Edge's print to PDF.
// Output: public/Sujin-Youn-Resume.pdf (one Letter page) and a preview PNG beside the source
import { spawn } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const proc = spawn(
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  ['--headless=new', '--remote-debugging-port=9660', `--user-data-dir=${mkdtempSync(join(tmpdir(), 'resume-'))}`, 'about:blank'],
  { stdio: 'ignore' },
)
let ws
for (let i = 0; i < 40 && !ws; i++) {
  await sleep(250)
  try {
    const page = (await (await fetch('http://127.0.0.1:9660/json')).json()).find((t) => t.type === 'page')
    if (page) ws = new WebSocket(page.webSocketDebuggerUrl)
  } catch {}
}
await new Promise((r) => ws.addEventListener('open', r))
let id = 0
const pending = new Map()
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data)
  if (pending.has(m.id)) {
    pending.get(m.id)(m)
    pending.delete(m.id)
  }
})
const send = (method, params = {}) =>
  new Promise((r) => {
    const i = ++id
    pending.set(i, r)
    ws.send(JSON.stringify({ id: i, method, params }))
  })

await send('Emulation.setDeviceMetricsOverride', { width: 816, height: 1056, deviceScaleFactor: 2, mobile: false })
await send('Page.navigate', { url: pathToFileURL(resolve('scripts/resume.html')).href })
await sleep(3000)
const h = await send('Runtime.evaluate', {
  expression: "document.fonts.ready.then(() => [document.body.scrollHeight, document.fonts.check('12px Inter')])",
  awaitPromise: true,
  returnByValue: true,
})
console.log('page height (max 1056), Inter loaded:', h.result.result.value)
const pdf = await send('Page.printToPDF', { printBackground: true, preferCSSPageSize: true, displayHeaderFooter: false })
writeFileSync('public/Sujin-Youn-Resume.pdf', Buffer.from(pdf.result.data, 'base64'))
const png = await send('Page.captureScreenshot', { format: 'png' })
writeFileSync('design-exports/resume/preview.png', Buffer.from(png.result.data, 'base64'))
proc.kill()
process.exit(0)
