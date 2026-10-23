import * as assert from 'node:assert/strict'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as vm from 'node:vm'
import { execFileSync } from 'node:child_process'

interface BrowserContext {
  [key: string]: unknown
  URL: typeof URL
  URLSearchParams: typeof URLSearchParams
  location: {
    href: string
    pathname: string
    search: string
    hash: string
    origin: string
    replace: (target: string) => void
  }
  history: {
    state: { existing: boolean }
    replaceState: (
      nextState: { existing: boolean },
      title: string,
      target: string
    ) => void
  }
  redirects: string[]
  replacements: string[]
}

// Pass a persistent scratch directory explicitly; never use system temp paths.
assert.ok(
  process.argv[2],
  'Usage: node scripts/build-github-pages.test.ts <scratch-directory>'
)
const outputDir = path.join(
  path.resolve(process.argv[2]),
  `pages-fallback-test-${process.pid}-${Date.now()}`
)
const apps = [
  'innbyggers-flate',
  'nav-veileders-flate',
  'tiltakskoordinator-flate',
  'tiltaksarrangor-flate'
]
const prefix = '/amt-deltaker-flate/'
const origin = 'https://navikt.github.io'
const parameter = '__amt_pages_route'
// Asset URLs belong to the generated test site, not the source directory.
// noinspection HtmlUnknownTarget
const originalIndex =
  '<!doctype html><html lang="nb"><head><meta charset="UTF-8"><script type="module" crossorigin src="/assets/app.js"></script><link href="/assets/app.css" rel="stylesheet"></head><body><div id="root"></div></body></html>'
const asset = 'unchanged application code'

function build(): void {
  execFileSync(process.execPath, [
    path.join(import.meta.dirname, 'build-github-pages.ts'),
    outputDir
  ])
}

function browser(href: string): BrowserContext {
  const url = new URL(href, origin)
  const redirects: string[] = []
  const replacements: string[] = []
  const state = { existing: true }
  return {
    URL,
    URLSearchParams,
    location: {
      href: url.href,
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
      origin: url.origin,
      replace: (target) => redirects.push(target)
    },
    history: {
      state,
      replaceState: (nextState, title, target) => {
        assert.equal(nextState, state)
        assert.equal(title, '')
        replacements.push(target)
      }
    },
    redirects,
    replacements
  }
}

function restore(
  script: string,
  appRoot: string,
  target: string
): BrowserContext {
  const context = browser(
    appRoot + '?' + parameter + '=' + encodeURIComponent(target)
  )
  vm.runInNewContext(script, context)
  return context
}

fs.mkdirSync(outputDir, { recursive: true })
try {
  for (const app of apps) {
    fs.mkdirSync(path.join(outputDir, app, 'assets'), { recursive: true })
    fs.writeFileSync(path.join(outputDir, app, 'index.html'), originalIndex)
    fs.writeFileSync(path.join(outputDir, app, 'assets/app.js'), asset)
  }
  build()
  const root = fs.readFileSync(path.join(outputDir, 'index.html'), 'utf-8')
  const fallback = fs.readFileSync(path.join(outputDir, '404.html'), 'utf-8')
  const redirectTag = fallback.match(
    /<script\b[^>]*>([\s\S]*?)<\/script\b[^>]*>/i
  )
  assert.ok(redirectTag)
  const redirectScript = redirectTag[1]
  assert.match(fallback, /404: Fant ikke siden/)
  assert.ok(!root.includes('amt-pages-restore'))
  assert.ok(!root.includes(parameter))

  for (const app of apps) {
    const appRoot = prefix + app + '/'
    assert.ok(fallback.includes(`href="${appRoot}"`))
    assert.ok(root.includes(`href="./${app}/"`))
    const indexPath = path.join(outputDir, app, 'index.html')
    const index = fs.readFileSync(indexPath, 'utf-8')
    const restoreTag = index.match(
      /<script id="amt-pages-restore">([\s\S]*?)<\/script>/
    )
    assert.ok(restoreTag)
    const restoreScript = restoreTag[1]
    assert.ok(
      index.indexOf(restoreTag[0]) < index.indexOf('<script type="module"')
    )
    assert.equal(index.replace('\n' + restoreTag[0], ''), originalIndex)
    assert.equal(
      fs.readFileSync(path.join(outputDir, app, 'assets/app.js'), 'utf-8'),
      asset
    )

    for (const route of [
      'deltaker/123',
      'deltaker/123?#',
      'deltaker/a%2Fb/%C3%A6?x=a%26b&x=a+b&empty=&encoded=%252F#tab%20one',
      'deltaker/123/?return=https%3A%2F%2Fexample.com%2F#details',
      'deltaker/123?__amt_pages_route=original#fragment'
    ]) {
      const original = appRoot + route
      const context = browser(original)
      vm.runInNewContext(redirectScript, context)
      assert.equal(context.redirects.length, 1)
      const destination = new URL(context.redirects[0], origin)
      assert.equal(destination.origin, origin)
      assert.equal(destination.pathname, appRoot)
      assert.equal(destination.searchParams.get(parameter), original)
      const restored = browser(destination.href)
      vm.runInNewContext(restoreScript, restored)
      assert.deepEqual(restored.replacements, [original])
      const appEntry = browser(destination.href)
      vm.runInNewContext(redirectScript, appEntry)
      assert.deepEqual(appEntry.redirects, [])
      assert.deepEqual(restored.redirects, [])
    }

    for (const suffix of [
      '',
      'index.html',
      'assets/missing',
      'assets/missing.js',
      'favicon.ico',
      'mockServiceWorker.js'
    ]) {
      const context = browser(appRoot + suffix + '?x=1#hash')
      vm.runInNewContext(redirectScript, context)
      assert.deepEqual(context.redirects, [])
      vm.runInNewContext(restoreScript, context)
      assert.deepEqual(context.replacements, [])
    }

    for (const invalid of [
      'https://evil.example' + appRoot + 'route',
      '//evil.example' + appRoot + 'route',
      prefix + 'unknown/route',
      prefix + apps.find((other) => other !== app) + '/route',
      appRoot + '../other/route',
      appRoot + '%2e%2e/other/route',
      appRoot + '\\..\\other/route',
      appRoot + 'route\n',
      appRoot.slice(0, -1) + '-other/route',
      ''
    ]) {
      assert.deepEqual(
        restore(restoreScript, appRoot, invalid).replacements,
        []
      )
    }
    const handoff = appRoot + '?' + parameter + '='
    const encodedRoute = encodeURIComponent(appRoot + 'route')
    for (const invalidEntry of [
      appRoot + 'nested?' + parameter + '=' + encodedRoute,
      handoff + encodedRoute + '&extra=1',
      handoff + encodedRoute + '&' + parameter + '=' + encodedRoute,
      handoff + encodedRoute + '#hash',
      handoff + '%ZZ'
    ]) {
      const context = browser(invalidEntry)
      vm.runInNewContext(restoreScript, context)
      assert.deepEqual(context.replacements, [])
    }
  }

  for (const pathname of [
    '/',
    prefix.slice(0, -1),
    prefix,
    prefix + 'index.html',
    prefix + 'unknown/route',
    prefix + 'assets/missing.js',
    '/other/innbyggers-flate/route',
    '//evil.example/route',
    prefix + 'innbyggers-flate-other/route',
    prefix + '%69nnbyggers-flate/route',
    ...apps.map((app) => prefix + app)
  ]) {
    const context = browser(pathname)
    vm.runInNewContext(redirectScript, context)
    assert.deepEqual(context.redirects, [])
  }

  const indexes = apps.map((app) =>
    fs.readFileSync(path.join(outputDir, app, 'index.html'), 'utf-8')
  )
  build()
  apps.forEach((app, index) => {
    assert.equal(
      fs.readFileSync(path.join(outputDir, app, 'index.html'), 'utf-8'),
      indexes[index]
    )
  })
  process.stdout.write(
    'Pages fallback tests passed for all four apps (handoff, validation, assembly, idempotence).\n'
  )
} finally {
  fs.rmSync(outputDir, { recursive: true, force: true })
}
