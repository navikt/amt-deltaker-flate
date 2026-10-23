#!/usr/bin/env node

import * as fs from 'node:fs'
import * as path from 'node:path'

interface PagesLocation {
  href: string
  pathname: string
  search: string
  hash: string
  origin: string
  replace(url: string): void
}

interface PagesHistory {
  state: unknown
  replaceState(data: unknown, title: string, url?: string | URL | null): void
}

declare const location: PagesLocation
declare const history: PagesHistory

interface App {
  id: string
  name: string
  desc: string
}

const APPS: App[] = [
  {
    id: 'innbyggers-flate',
    name: 'Innbyggers Flate',
    desc: 'Applikasjonen for innbyggere (deltakere i tiltak).'
  },
  {
    id: 'nav-veileders-flate',
    name: 'Nav Veileders Flate',
    desc: 'Applikasjonen for NAV-veiledere.'
  },
  {
    id: 'tiltakskoordinator-flate',
    name: 'Tiltakskoordinator Flate',
    desc: 'Applikasjonen for tiltakskoordinatorer.'
  },
  {
    id: 'tiltaksarrangor-flate',
    name: 'Tiltaksarrangørflate',
    desc: 'Applikasjonen for tiltaksarrangører.'
  }
]

const SITE_PREFIX = '/amt-deltaker-flate/'
const ROUTE_PARAMETER = '__amt_pages_route'
const RESTORE_ID = 'amt-pages-restore'

function redirectToApp(
  sitePrefix: string,
  appIds: string[],
  parameter: string
) {
  const appId = appIds.find((id) =>
    location.pathname.startsWith(sitePrefix + id + '/')
  )
  if (!appId) return

  const appRoot = sitePrefix + appId + '/'
  const route = location.pathname.slice(appRoot.length)
  // Missing entry points and assets must remain 404s, not redirect loops.
  if (
    !route ||
    route === 'index.html' ||
    route.startsWith('assets/') ||
    /\.(?:js|mjs|css|map|json|ico|png|jpe?g|gif|svg|webp|woff2?|ttf|html)$/i.test(
      route
    )
  ) {
    return
  }

  const original = location.href.slice(location.origin.length)
  location.replace(
    appRoot + '?' + parameter + '=' + encodeURIComponent(original)
  )
}

function restoreRoute(appRoot: string, parameter: string) {
  if (location.pathname !== appRoot || location.hash) return

  const parameters = new URLSearchParams(location.search)
  if (parameters.size !== 1 || !parameters.has(parameter)) return

  const original = parameters.get(parameter)
  if (!original || !original.startsWith(appRoot)) return

  const target = new URL(original, location.origin)
  if (
    target.origin !== location.origin ||
    !target.pathname.startsWith(appRoot) ||
    target.href !== location.origin + original
  ) {
    return
  }

  history.replaceState(history.state, '', original)
}

function inlineScript<Args extends unknown[]>(
  fn: (...args: Args) => void,
  ...args: Args
): string {
  return `(${fn.toString()})(${args.map((arg) => JSON.stringify(arg)).join(',')});`
}

const templatePath = path.join(import.meta.dirname, 'index.template.html')
const appCardTemplatePath = path.join(
  import.meta.dirname,
  'app-card.template.html'
)
const template = fs.readFileSync(templatePath, 'utf-8')
const appCardTemplate = fs.readFileSync(appCardTemplatePath, 'utf-8')

const appCards = APPS.map((app) =>
  appCardTemplate
    .replaceAll('{{id}}', app.id)
    .replaceAll('{{name}}', app.name)
    .replaceAll('{{desc}}', app.desc)
).join('\n')

const html = template.replace('<!-- APP_CARDS_PLACEHOLDER -->', appCards)

const outputDir: string = process.argv[2] || '.'
const appIndexes = APPS.map((app) => {
  const indexPath = path.join(outputDir, app.id, 'index.html')
  const index = fs.readFileSync(indexPath, 'utf-8')
  if (!/<head\b[^>]*>/i.test(index)) {
    throw new Error(`Missing head element in ${indexPath}`)
  }

  const script = `<script id="${RESTORE_ID}">${inlineScript(
    restoreRoute,
    SITE_PREFIX + app.id + '/',
    ROUTE_PARAMETER
  )}</script>`
  const withoutRestore = index.replace(
    new RegExp(`\\n?<script id="${RESTORE_ID}">[\\s\\S]*?</script>`, 'g'),
    ''
  )
  return {
    indexPath,
    html: withoutRestore.replace(
      /<head\b[^>]*>/i,
      (head) => `${head}\n${script}`
    )
  }
})

const fallback = html
  .replace(
    '<title>AMT Deltaker Flate - Demo Apps</title>',
    '<title>404</title>'
  )
  .replace('<h1>AMT Deltaker Flate</h1>', '<h1>404: Fant ikke siden</h1>')
  .replaceAll('href="./', `href="${SITE_PREFIX}`)
  .replace(
    '</head>',
    `<script>${inlineScript(
      redirectToApp,
      SITE_PREFIX,
      APPS.map((app) => app.id),
      ROUTE_PARAMETER
    )}</script>\n</head>`
  )

fs.mkdirSync(outputDir, { recursive: true })
fs.writeFileSync(path.join(outputDir, 'index.html'), html, 'utf-8')
fs.writeFileSync(path.join(outputDir, '404.html'), fallback, 'utf-8')
for (const app of appIndexes) {
  fs.writeFileSync(app.indexPath, app.html, 'utf-8')
}
