# amt-deltaker-flate

Monorepo for frontend-appene som følger opp deltakere i arbeidsmarkedstiltak.

## Innhold

- [Apper](#apper)
- [Kom i gang](#kom-i-gang)
- [Kommandoer](#kommandoer)
- [Struktur](#struktur)
- [Teknologi](#teknologi)
- [Testmiljøer og deploy](#testmiljøer-og-deploy)
- [Feilsøking](#feilsøking)
- [Bidra](#bidra)
- [Team](#team)
- [Lisens](#lisens)

## Apper

| App                                                                   | Bruk                                                                  |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| [`innbyggers-flate`](apps/innbyggers-flate/README.md)                 | Viser deltakelsen til innbyggeren og lenkes til fra aktivitetsplanen. |
| [`nav-veileders-flate`](apps/nav-veileders-flate/README.md)           | Web component for oppfølging i Modia.                                 |
| [`tiltakskoordinator-flate`](apps/tiltakskoordinator-flate/README.md) | Web component for deltakerlister i tiltaksadministrasjonen.           |
| [`tiltaksarrangor-flate`](apps/tiltaksarrangor-flate/README.md)       | Flate for tiltaksarrangørens oppfølging av deltakere.                 |

## Kom i gang

**Forutsetninger:**

- Node.js 26
- pnpm 12.15.0
- tilgang til pakkene i `@navikt`-scopet

Lag et [classic personal access token](https://github.com/settings/tokens) med `read:packages`. Autoriser tokenet for `navikt` med **Configure SSO**, og legg det i `.bashrc` eller `.zshrc`:

```bash
export NODE_AUTH_TOKEN=<personal-access-token>
```

Legg følgende i `~/.npmrc` hvis det ikke allerede finnes:

```ini
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
@navikt:registry=https://npm.pkg.github.com
```

Installer avhengighetene og start appene fra rotmappa:

```bash
pnpm install
pnpm start
```

Start én app med pnpm-filter:

```bash
pnpm --filter nav-veileders-flate start
```

## Kommandoer

| Kommando             | Hva den gjør                                  |
| -------------------- | --------------------------------------------- |
| `pnpm start`         | Starter alle appene lokalt.                   |
| `pnpm build`         | Bygger alle appene for produksjon.            |
| `pnpm test:no-watch` | Kjører Vitest-testene én gang.                |
| `pnpm playwright`    | Kjører Playwright-testene.                    |
| `pnpm type-check`    | Typesjekker alle workspaces.                  |
| `pnpm lint`          | Kjører ESLint.                                |
| `pnpm lint:fix`      | Retter ESLint-feil som kan rettes automatisk. |
| `pnpm format`        | Formaterer filer med Prettier.                |

Turbo kjører scriptet med samme navn i hvert workspace. Nye rot-scripts må derfor defineres både i rotas `package.json`, i `turbo.json` og i relevante workspaces.

## Struktur

| Mappe                             | Innhold                                                        |
| --------------------------------- | -------------------------------------------------------------- |
| `apps/`                           | De fire frontend-appene.                                       |
| `packages/deltaker-flate-common/` | Delte React-komponenter, typer og hjelpefunksjoner.            |
| `shared-config/`                  | Felles oppsett for ESLint, TypeScript, Tailwind og Playwright. |
| `.github/workflows/`              | Test-, preview- og deploy-workflows.                           |
| `.nais/`                          | Felles konfigurasjon for `poao-frontend`.                      |

Nye workspaces må legges til i `pnpm-workspace.yaml`.

## Teknologi

- React 19 og TypeScript
- Vite og Vitest
- Playwright
- Aksel og Tailwind CSS
- pnpm workspaces og Turborepo
- Nais, Navs CDN og Google Cloud Storage

## Testmiljøer og deploy

GitHub Actions finner hvilke apper som er endret. Ved push til `main` testes, bygges og deployes de berørte appene. Workflowen kan også startes manuelt for én app eller alle apper til dev eller produksjon. Manuell demo-deploy støtter én app om gangen og er ikke tilgjengelig for `tiltaksarrangor-flate`.

### Integrasjoner i dev

I dev er oppsettet forskjellig per app, avhengig av hvor appen er integrert:

| App                        | Hvor den brukes                                     | Integrasjonsform                  |
| -------------------------- | --------------------------------------------------- | --------------------------------- |
| `tiltakskoordinator-flate` | Tiltaksadministrasjonen                             | Web component                     |
| `nav-veileders-flate`      | Modia (`veilarbpersonflate`)                        | Web component                     |
| `innbyggers-flate`         | Selvstendig app som lenkes til fra aktivitetsplanen | Egen Nais-app via `poao-frontend` |
| `tiltaksarrangor-flate`    | Selvstendig app på `/deltakeroversikt`              | Egen Nais-app via `poao-frontend` |

### Lagring av frontend-filer

| App                        | Dev                  | Demo              | Produksjon           |
| -------------------------- | -------------------- | ----------------- | -------------------- |
| `innbyggers-flate`         | Google Cloud Storage | Navs CDN          | Google Cloud Storage |
| `nav-veileders-flate`      | Navs CDN             | Navs CDN          | Navs CDN             |
| `tiltakskoordinator-flate` | Navs CDN             | Navs CDN          | Navs CDN             |
| `tiltaksarrangor-flate`    | Google Cloud Storage | Ikke tilgjengelig | Google Cloud Storage |

Demo-appene bruker mockdata. `poao-frontend` serverer demo-byggene fra Navs CDN fordi repoet ikke har en egen webserver for disse miljøene.

## Feilsøking

### GitHub Actions-schema i IntelliJ

Hvis IntelliJ viser feilaktige advarsler i `.github/workflows`, kan du overstyre det innebygde GitHub Actions-schemaet:

1. Åpne **Settings → Languages & Frameworks → Schemas and DTDs → JSON Schema Mappings**.
2. Legg til et schema med URL-en `https://raw.githubusercontent.com/SchemaStore/schemastore/master/src/schemas/json/github-workflow.json`.
3. Velg **JSON Schema version 7** (`Draft-07`).
4. Knytt schemaet til `.github/workflows/*.yaml` og `.github/workflows/*.yml`.
5. Åpne workflow-fila og klikk på schema-navnet nederst til høyre i IntelliJ. Kontroller at det egendefinerte schemaet er valgt.
6. Slå på **Always download the most recent version of schemas** under **Settings → Languages & Frameworks → Schemas and DTDs → JSON Schema**.
7. Bruk **File → Invalidate Caches… → Invalidate and Restart** hvis IntelliJ fortsatt viser advarsler fra det gamle schemaet.

IntelliJ lagrer egendefinerte schema-mappinger per prosjekt i `.idea/jsonSchemas.xml`. Det finnes ingen global innstilling for slike mappinger.

## Bidra

1. Lag en branch fra `main`.
2. Gjør endringene i riktig app eller delt pakke.
3. Kjør relevante tester, typesjekk og lint.
4. Opprett en pull request.

## Team

Team Komet vedlikeholder repoet. Interne spørsmål kan stilles i Slack-kanalen `#team_komet`. Andre spørsmål kan opprettes som GitHub-issues.

## Lisens

Se [LICENSE](LICENSE).

## KI-assistanse

Repoet bruker GitHub Copilot for kodeforslag.
