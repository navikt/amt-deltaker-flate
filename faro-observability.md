# Søk etter Faro-data i Mimir og Loki

Faro sender Web Vitals til Mimir og events, exceptions og logger til Loki. Bruk Mimir for ytelsesmålinger og Loki for å kontrollere hvilke signaler appene sender.

## Forutsetninger

Du må være koblet til Nav-nettet og ha tilgang til observability-endepunktene. Kommandoene bruker `curl` og `jq`.

Hvis du kjører kommandoene fra Copilot CLI, kan du måtte tillate de private domenene:

```sh
cplt config set proxy.allow_private_domains mimir.nav.cloud.nais.io
cplt config set proxy.allow_private_domains loki.nav.cloud.nais.io
```

Start Copilot CLI på nytt etter at du har endret innstillingene.

## Appnavn

Bytt verdien i `app_name` for å undersøke en annen app:

| App                                 | `app_name`                      |
| ----------------------------------- | ------------------------------- |
| Innbyggerflate                      | `amt-deltaker-innbyggers-flate` |
| Veilederens mikrofrontend           | `amt-deltaker-flate`            |
| Tiltakskoordinatorens mikrofrontend | `amt-tiltakskoordinator-flate`  |
| Host for mikrofrontendene           | `veilarbpersonflate`            |

## Finn LCP-serier i Mimir

Denne spørringen viser om Mimir har registrert LCP-serier for appen:

```sh
QUERY='count by (env, app_name) (
  loki_process_custom_faro_web_vitals_lcp_milliseconds_bucket{
    app_name="amt-deltaker-innbyggers-flate"
  }
)'

curl -fsS -G \
  -H 'X-Scope-OrgID: tenant' \
  'https://mimir.nav.cloud.nais.io/prometheus/api/v1/query' \
  --data-urlencode "query=$QUERY" |
jq
```

Et tomt `result` betyr at Mimir ikke har en LCP-serie for appen. Nais APM bruker denne serien for å avgjøre om frontend-observability er tilgjengelig.

## Tell Web Vitals i Mimir

Denne spørringen teller Web Vitals-målinger fra de siste 15 minuttene:

```sh
QUERY='sum by (env, app_name) (
  increase(
    loki_process_custom_faro_web_vital_measurements_total{
      app_name="amt-deltaker-innbyggers-flate"
    }[15m]
  )
)'

curl -fsS -G \
  -H 'X-Scope-OrgID: tenant' \
  'https://mimir.nav.cloud.nais.io/prometheus/api/v1/query' \
  --data-urlencode "query=$QUERY" |
jq
```

Bytt `[15m]` til for eksempel `[1h]` for å undersøke et lengre tidsrom.

## Tell Faro-signaler i Loki

Denne spørringen teller signalene fra de siste 15 minuttene og grupperer dem etter app, miljø og type:

```sh
QUERY='sum by (app_name, env, kind) (
  count_over_time(
    {app_name="amt-deltaker-innbyggers-flate"}[15m]
  )
)'

curl -fsS -G \
  -H 'X-Scope-OrgID: tenant' \
  'https://loki.nav.cloud.nais.io/loki/api/v1/query' \
  --data-urlencode "query=$QUERY" |
jq
```

Feltet `kind` kan blant annet ha disse verdiene:

- `event`: brukerhendelser og Faro-hendelser
- `exception`: JavaScript-feil og exceptions
- `measurement`: Web Vitals og andre målinger
- `log`: logger sendt gjennom Faro

## Finn exceptions i Loki

Bruk denne LogQL-spørringen i Grafana Explore for å finne exceptions fra innbyggerflaten:

```logql
{service_name="amt-deltaker-innbyggers-flate", env="prod", kind="exception"}
```

For mikrofrontendene bruker du ett av disse appnavnene:

```logql
{service_name="amt-deltaker-flate", env="prod", kind="exception"}
```

```logql
{service_name="amt-tiltakskoordinator-flate", env="prod", kind="exception"}
```

Loggene kan inneholde tekniske feildetaljer. Ikke kopier personopplysninger eller tokens ut av Grafana.

## Kjør spørringene i Grafana Explore

1. Velg Mimir-datakilden for PromQL-spørringene.
2. Velg Loki-datakilden for LogQL-spørringene.
3. Sett ønsket tidsrom øverst i Grafana.
4. Lim inn uttrykket fra variabelen `QUERY`, uten `QUERY='...'` og shell-formatering.

Mikrofrontendene lastes etter hostsida og produserer derfor ikke nødvendigvis egne Web Vitals. Se på `veilarbpersonflate` for LCP, INP, CLS, FCP og TTFB for den samlede sida. Bruk mikrofrontendenes appnavn for deres events og exceptions.
