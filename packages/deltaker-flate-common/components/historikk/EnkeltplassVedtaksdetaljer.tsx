import { BodyLong } from '@navikt/ds-react'
import type { Tiltakskode } from '../../model/deltaker'
import type { Vedtak } from '../../model/deltakerHistorikk'
import { formatDate } from '../../utils/utils'
import { DeltakelseInnhold } from '../DeltakelseInnhold'
import { DeltakelsesmengdeBodyLongSection } from '../DeltakelsesmengdeHistorikkVisning'

interface Props {
  vedtak: Vedtak
  tiltakskode: Tiltakskode
}

export const EnkeltplassVedtaksdetaljer = ({ vedtak, tiltakskode }: Props) => {
  return (
    <>
      <BodyLong size="small" className="mb-2">
        Vedtak fattet {formatDate(vedtak.fattet)}.
      </BodyLong>
      <BodyLong size="small" className="mb-2">
        <span className="font-semibold">Dato:</span>{' '}
        {formatDate(vedtak.startdato)} – {formatDate(vedtak.sluttdato)}
      </BodyLong>
      <DeltakelseInnhold
        tiltakskode={tiltakskode}
        deltakelsesinnhold={vedtak.deltakelsesinnhold}
        opplaringKategoriseringValg={vedtak.opplaringKategorisering}
        heading={
          <BodyLong size="small" weight="semibold">
            Dette er innholdet
          </BodyLong>
        }
      />
      <DeltakelsesmengdeBodyLongSection
        tiltakskode={tiltakskode}
        erEnkeltplass
        deltakelsesprosent={vedtak.deltakelsesprosent}
        dagerPerUke={vedtak.dagerPerUke}
        className="mt-2"
      />
      {vedtak.bakgrunnsinformasjon && (
        <>
          <BodyLong size="small" weight="semibold" className="mt-2">
            Bakgrunnsinfo
          </BodyLong>
          <BodyLong size="small" className="whitespace-pre-wrap">
            {vedtak.bakgrunnsinformasjon}
          </BodyLong>
        </>
      )}
    </>
  )
}
