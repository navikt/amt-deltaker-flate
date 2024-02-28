# amt-deltaker

Dett er et monorepo for amt deltaker flater for NAV-veileder og innbygger.

## monorepo

Vi bruker turborepo med pnpm.
apps har flatene, shared-cinfig har oppsett for typescript og eslint.

- `nav-veileders-falte`: react app som webcomponent.
- `shared-config`: another [Next.js](https://nextjs.org/) app
- `@repo/eslint-config`: `eslint` config
- `@repo/typescript-config`: `tsconfig.json` delt gjennom hele monorepoet

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

Turborepo er satt opp med:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

Bygg alt ved å stå i rot:

```
cd amt-deltaker
pnpm build
```

### Kjør appper lokalt

```
cd amt-deltaker
pnpm start
```

## tips

`turbo.json` inneholder oppgaver / tasks som turbo kan kjøre. Når vi i `package.json` har scripts som sier `turbo test` er det test-oppgaven i `turbo.json` som kalles. Nye scripts som skal kjøres fra rot må deifneres der. Oppgavene må ha navn som samsvarer med scripts i de ulike appenes `package.json`

nye workspaces må defineres i `pnpm-workspace.yaml`
