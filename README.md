# amt-deltaker


TODO 
```shell
 window.history.pushState(null, '', '/arbeidsmarkedstiltak/deltakelse/450e0f37-c4bb-4611-ac66-f725e05bad3e')
 window.history.pushState(null, '', '/arbeidsmarkedstiltak/deltakelse/deltaker/a86cf0ca-a7ab-4e0f-9c41-544ddf0efbcc')
 window.dispatchEvent(new CustomEvent('veilarbpersonflate.navigate'))
```

Dett er et monorepo for amt deltaker flater for NAV-veileder og innbygger.

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

### Build

Bygg alt ved å stå i rot:

```
cd amt-deltaker-flate
pnpm build
```

### Kjør appper lokalt

```
cd amt-deltaker-flate
pnpm start
```

## tips

`turbo.json` inneholder oppgaver / tasks som turbo kan kjøre. Når vi i `package.json` har scripts som sier `turbo test` er det test-oppgaven i `turbo.json` som kalles. Nye scripts som skal kjøres fra rot må deifneres der. Oppgavene må ha navn som samsvarer med scripts i de ulike appenes `package.json`

nye workspaces må defineres i `pnpm-workspace.yaml`

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på github.

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #team_komet.
