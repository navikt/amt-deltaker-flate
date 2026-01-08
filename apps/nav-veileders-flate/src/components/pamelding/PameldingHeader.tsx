import { ChevronRightIcon } from '@navikt/aksel-icons'
import { BodyShort, Detail, Heading } from '@navikt/ds-react'
import {
  DeltakerStatus,
  DeltakerStatusTag,
  DeltakerStatusType,
  getTiltakskodeDisplayText,
  hentTiltakGjennomforingNavnArrangorTittel,
  UtkastHeader,
  Vedtaksinformasjon
} from 'deltaker-flate-common'
import { Deltakerliste } from '../../api/data/pamelding.ts'
import { TiltaksgjennomforingLink } from '../TiltaksgjennomforingLink.tsx'

interface Props {
  deltakerStatus: DeltakerStatus
  deltakerliste: Deltakerliste
  vedtaksinformasjon: Vedtaksinformasjon | null
}

export const PameldingHeader = ({
  deltakerStatus,
  deltakerliste,
  vedtaksinformasjon
}: Props) => {
  let statusTekst = ''
  switch (deltakerStatus.type) {
    case DeltakerStatusType.AVBRUTT_UTKAST:
      statusTekst = 'Avbrutt utkast'
      break
    case DeltakerStatusType.UTKAST_TIL_PAMELDING:
      statusTekst = 'Utkastet er delt og venter på godkjenning'
      break
    case DeltakerStatusType.KLADD:
      statusTekst = 'Kladd til påmelding"'
      break
  }

  const erKladd = deltakerStatus.type === DeltakerStatusType.KLADD

  return (
    <div>
      <Heading level="1" size="large">
        {hentTiltakGjennomforingNavnArrangorTittel(
          deltakerliste.deltakerlisteNavn,
          deltakerliste.tiltakskode,
          deltakerliste.arrangorNavn
        )}
      </Heading>

      <Detail className="mb-4">
        {getTiltakskodeDisplayText(deltakerliste.tiltakskode)}
      </Detail>

      {(erKladd ||
        deltakerStatus.type === DeltakerStatusType.AVBRUTT_UTKAST) && (
        <div className="mb-4">
          <DeltakerStatusTag
            statusType={deltakerStatus.type}
            name={statusTekst}
          />
        </div>
      )}

      {!erKladd && (
        <UtkastHeader
          visStatusVenterPaaBruker={
            deltakerStatus.type === DeltakerStatusType.UTKAST_TIL_PAMELDING
          }
          vedtaksinformasjon={vedtaksinformasjon}
          deltakerStatus={deltakerStatus}
          erNAVVeileder
        />
      )}

      {!deltakerliste.erEnkeltplassUtenRammeavtale && (
        <TiltaksgjennomforingLink
          deltakerlisteId={deltakerliste.deltakerlisteId}
        >
          <div className="flex">
            <BodyShort size="small">Gå til tiltaksgjennomføringen</BodyShort>
            <ChevronRightIcon aria-label="Gå til tiltaksgjennomføringen" />
          </div>
        </TiltaksgjennomforingLink>
      )}
    </div>
  )
}
