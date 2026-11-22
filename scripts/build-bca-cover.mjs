// BCA cover: screenshots scripts/bca-cover.html in headless Edge (so it can use the project's own
// fonts, Bricolage Grotesque and Inter) and saves it as public/images/projects/bca-cover.webp.
// Run scripts/prepare-bca.mjs first (the cover uses bca-web-home.webp, the round logo and the
// Events phone frame).
import { spawn } from 'node:child_process'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import sharp from 'sharp'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const PORT = 9671
const proc = spawn(
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  ['--headless=new', `--remote-debugging-port=${PORT}`, '--allow-file-access-from-files', `--user-data-dir=${mkdtempSync(join(tmpdir(), 'bca-cover-'))}`, 'about:blank'],
  { stdio: 'ignore' },
)
let ws
for (let i = 0; i < 40 && !ws; i++) {
  await sleep(250)
  try {
    const page = (await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()).find((t) => t.type === 'page')
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

await send('Emulation.setDeviceMetricsOverride', { width: 1600, height: 900, deviceScaleFactor: 1, mobile: false })
await send('Page.navigate', { url: pathToFileURL(resolve('scripts/bca-cover.html')).href })
await sleep(3000)
const ok = await send('Runtime.evaluate', {
  expression: "document.fonts.ready.then(() => document.fonts.check('80px \"Bricolage Grotesque\"'))",
  awaitPromise: true,
  returnByValue: true,
})
console.log('Bricolage loaded:', ok.result.result.value)
const shot = await send('Page.captureScreenshot', { format: 'png' })
await sharp(Buffer.from(shot.result.data, 'base64')).webp({ quality: 86 }).toFile('public/images/projects/bca-cover.webp')
console.log('saved public/images/projects/bca-cover.webp')
ws.close()
proc.kill()
process.exit(0)
