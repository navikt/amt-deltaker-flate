import { Alert, BodyLong, Heading, Textarea } from '@navikt/ds-react'
import { EndreDeltakelseType } from 'deltaker-flate-common'
import { useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { endreDeltakelseBakgrunnsinfo } from '../../../api/api.ts'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { BAKGRUNNSINFORMASJON_MAKS_TEGN } from '../../../model/PameldingFormValues.ts'
import { getFeilmeldingIngenEndring } from '../../../utils/displayText.ts'
import { Endringsmodal } from '../modal/Endringsmodal.tsx'

interface EndreBakgrunnsinfoModalProps {
  pamelding: PameldingResponse
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

export const EndreBakgrunnsinfoModal = ({
  pamelding,
  open,
  onClose,
  onSuccess
}: EndreBakgrunnsinfoModalProps) => {
  const { enhetId } = useAppContext()
  const [bakgrunnsinformasjon, setBakgrunnsinformasjon] = useState<
    string | null
  >(pamelding.bakgrunnsinformasjon)
  const [error, setError] = useState<string | null>(null)

  const validertRequest = () => {
    if (
      bakgrunnsinformasjon &&
      bakgrunnsinformasjon.length > BAKGRUNNSINFORMASJON_MAKS_TEGN
    ) {
      setError(
        `Bakgrunnsinfo kan ikke være mer enn ${BAKGRUNNSINFORMASJON_MAKS_TEGN} tegn.`
      )
      return null
    }

    if (bakgrunnsinformasjon === pamelding.bakgrunnsinformasjon) {
      throw new Error(getFeilmeldingIngenEndring(false))
    }

    return {
      deltakerId: pamelding.deltakerId,
      enhetId,
      body: {
        bakgrunnsinformasjon
      }
    }
  }

  return (
    <Endringsmodal
      open={open}
      endringstype={EndreDeltakelseType.ENDRE_BAKGRUNNSINFO}
      digitalBruker={pamelding.digitalBruker}
      harAdresse={pamelding.harAdresse}
      onClose={onClose}
      onSend={onSuccess}
      apiFunction={endreDeltakelseBakgrunnsinfo}
      validertRequest={validertRequest}
      forslag={null}
      erUnderOppfolging={pamelding.erUnderOppfolging}
    >
      <>
        {pamelding.importertFraArena && !pamelding.bakgrunnsinformasjon && (
          <Alert variant="info" className="mb-6">
            <Heading size="small" level="2">
              Bakgrunnsinfo erstatter bestillingen fra Arena
            </Heading>
            <BodyLong size="small">
              Fordi deltakeren er meldt på i Arena så ser arrangør
              bestillingsteksten fra Arena i Deltakeroversikten. Når du lagrer
              en ny bakgrunnsinfo her så vil den erstatte bestillingen, og
              teksten fra Arena vil ikke lenger vises til arrangør.
            </BodyLong>
          </Alert>
        )}

        <Heading level="2" size="small" className="mb-4">
          Bakgrunnsinfo
        </Heading>
        <Textarea
          onChange={(e) => {
            setError(null)
            setBakgrunnsinformasjon(e.target.value)
          }}
          label="Er det noe mer dere ønsker å informere arrangøren om?"
          description="Er det noe rundt personens behov eller situasjon som kan påvirke deltakelsen på tiltaket?"
          value={bakgrunnsinformasjon ?? ''}
          maxLength={BAKGRUNNSINFORMASJON_MAKS_TEGN}
          id="bakgrunnsinformasjon"
          size="small"
          aria-label={'Bagrunnsinfo'}
          error={error}
          disabled={!pamelding.erUnderOppfolging}
        />
      </>
    </Endringsmodal>
  )
}
