import { DeltakerStatusType } from 'deltaker-flate-common'
import { Deltaker } from '../api/data/deltakerliste'

/**
 * Test-factory for å lage en Deltaker med fornuftige defaults.
 * Override kun det som er relevant for testen.
 */
export const lagTestDeltaker = (overrides?: Partial<Deltaker>): Deltaker =>
  ({
    id: 'deltaker-1',
    fornavn: 'Ola',
    mellomnavn: null,
    etternavn: 'Nordmann',
    status: { type: DeltakerStatusType.SOKT_INN, aarsak: null },
    vurdering: null,
    beskyttelsesmarkering: [],
    navEnhet: 'Nav Grünerløkka',
    erManueltDeltMedArrangor: false,
    ikkeDigitalOgManglerAdresse: false,
    harAktiveForslag: false,
    erNyDeltaker: false,
    harOppdateringFraNav: false,
    kanEndres: true,
    soktInnDato: '2025-01-15',
    startdato: '2025-02-01',
    sluttdato: '2025-06-01',
    ...overrides
  }) as Deltaker
