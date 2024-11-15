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

## For Nav-ansatte

Interne henvendelser kan sendes via Slack i kanalen #team_komet.
