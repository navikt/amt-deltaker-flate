# amt-deltaker

Dett er et monorepo for amt deltaker flater for Nav-veileder og innbygger.

## monorepo

Vi bruker turborepo med pnpm.
apps har flatene, shared-cinfig har oppsett for typescript og eslint.

- `nav-veileders-falte`: react app som webcomponent.
- `shared-config`: another [Next.js](https://nextjs.org/) app
- `@amt-deltaker-flate/eslint-config`: `eslint` config
- `@amt-deltaker-flate/typescript-config`: `tsconfig.json` delt gjennom hele monorepoet

### Utilities

Turborepo er satt opp med:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Oppsett

For å sette opp prosjektet lokalt, må du ha [Node.js](https://nodejs.org/) og [pnpm](https://pnpm.io/) installert.

### Installere pakker lokalt

For å installere npm pakker med @navikt-scope lokalt må du først lage et PAT(Personal Access Token) i github.
Token genererer du under [developer settings](https://github.com/settings/tokens).

1. Lag et classic token som har `read:packages` rettigheter.
2. Autoriser tokenet etter generering med `configure SSO`, velg authorize for `navikt`-organisasjonen.
3. For å unngå å bruke PAT i klartekst, må du sette det som en environment variabel. Legg til følgende i din `.bashrc` eller `.zshrc` fil:
   ```bash
   export NODE_AUTH_TOKEN=<your_personal_access_token>
   ```
4. Om du ikke har det fra før lag en `.npmrc`-fil i rot på maskinen din med følgende innhold:
   ```
   //npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
   @navikt:registry=https://npm.pkg.github.com
   ```
   evt. bruk .npmrc-filen som ligger i rot av prosjekt.
5. Etter stegene over er gjort kan du kjøre `pnpm install` for å installere alle avhengigheter.

### Build

Bygg alt ved å stå i rot:

```
cd amt-deltaker-flate
pnpm build
```

### Kjør apper lokalt

```
cd amt-deltaker-flate
pnpm start
```

## tips

`turbo.json` inneholder oppgaver / tasks som turbo kan kjøre. Når vi i `package.json` har scripts som sier `turbo test` er det test-oppgaven i `turbo.json` som kalles. Nye scripts som skal kjøres fra rot må deifneres der. Oppgavene må ha navn som samsvarer med scripts i de ulike appenes `package.json`

nye workspaces må defineres i `pnpm-workspace.yaml`

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på github.

## For Nav-ansatte

Interne henvendelser kan sendes via Slack i kanalen #team_komet.

## 🤖 KI-assistanse - GitHub Copilot

Dette repoet bruker GitHub Copilot for kodeforslag.

# Testmiljøer

Vi har to typer testmiljøer: **demo** (isolert med mock-data) og **dev** (integrert mot reelle dev-tjenester).

## Demo-apper

Demo-appene kjøres som egne Docker-images via `nais-demo.yaml` og brukes til:

- intern testing i teamet
- opplæring på Nav-kontor og i fylker

Kjennetegn:

- Appene bygges med **mocker**, slik at frontend kan testes helt isolert fra backend.
- De serveres av [`poao-frontend`](https://github.com/navikt/poao-frontend) som webserver, fordi vi ikke har en egen webserver satt opp i dette repoet.
- `poao-frontend` henter de statiske filene fra Navs CDN.

## Dev

I dev er oppsettet forskjellig per app, avhengig av hvor appen er integrert:

| App                        | Hvor den kjører                                  | Hvor statiske filer hentes fra |
| -------------------------- | ------------------------------------------------ | ------------------------------ |
| `tiltakskoordinator-flate` | Nav tiltaksadministrasjon                        | Navs CDN                       |
| `nav-veileders-flate`      | Modia                                            | Navs CDN (i dev)               |
| `innbyggers-flate`         | Selvstendig app, lenkes til fra aktivitetsplanen | Egen kjørende instans          |

> ⚠️ **Merk:** I prod hentes `nav-veileders-flate` fra den kjørende instansen i stedet for Navs CDN. Dette bør på sikt endres slik at prod og dev fungerer likt.
