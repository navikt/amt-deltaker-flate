#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports, no-undef */

const fs = require('fs')
const path = require('path')

const APPS = [
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
  }
]

const templatePath = path.join(__dirname, 'index.template.html')
const appCardTemplatePath = path.join(__dirname, 'app-card.template.html')
const template = fs.readFileSync(templatePath, 'utf-8')
const appCardTemplate = fs.readFileSync(appCardTemplatePath, 'utf-8')

const appCards = APPS.map((app) =>
  appCardTemplate
    .replaceAll('{{id}}', app.id)
    .replaceAll('{{name}}', app.name)
    .replaceAll('{{desc}}', app.desc)
).join('\n')

const html = template.replace('    <!-- APPS_PLACEHOLDER -->', appCards)

const outputDir = process.argv[2] || '.'
fs.mkdirSync(outputDir, { recursive: true })
fs.writeFileSync(path.join(outputDir, 'index.html'), html, 'utf-8')
