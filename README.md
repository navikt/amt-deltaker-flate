# amt-pamelding-flate

Mikrofrontend for mulighetsrommet ... - Arbeidsmarkedstiltak

basert på [navikt/tms-mikrofrontend-template-vitets](https://github.com/navikt/tms-mikrofrontend-template-vitets/tree/main)

## Kom i gang

1. Intstaller amt-pamelding-flate:  `pnpm i`
2. Start appen lokalt: `pnpm start`

## Test produskjonsbygg av bare mikrofrontenden lokalt med docker
1. `pnpm build`
2. `docker-compose down && docker-compose rm && docker-compose up --build`
3. Gå til http://localhost:8080/amt/amt-pamelding-flate/bundle.js
4. Avslutt med `ctrl` + `c`

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på github.

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #team_komet.
