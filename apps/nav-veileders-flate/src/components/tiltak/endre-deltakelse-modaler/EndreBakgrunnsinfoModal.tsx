import { Alert, BodyLong, Heading, Textarea } from '@navikt/ds-react'
import { EndreDeltakelseType, fjernUgyldigeTegn } from 'deltaker-flate-common'
import { useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { endreDeltakelseBakgrunnsinfo } from '../../../api/api.ts'
import { DeltakerResponse } from '../../../api/data/deltaker.ts'
import { getFeilmeldingIngenEndringTekst } from '../../../utils/displayText.ts'
import { Endringsmodal } from '../modal/Endringsmodal.tsx'
import { validerDeltakerKanEndres } from '../../../utils/endreDeltakelse.ts'
import { bakgrunnsinfoSporsmal } from '../../pamelding/bakgrunnsinfo-sporsmal.ts'

interface EndreBakgrunnsinfoModalProps {
  deltaker: DeltakerResponse
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertDeltaker: DeltakerResponse | null) => void
}

export const EndreBakgrunnsinfoModal = ({
  deltaker,
  open,
  onClose,
  onSuccess
}: EndreBakgrunnsinfoModalProps) => {
  const { enhetId } = useAppContext()
  const [bakgrunnsinformasjon, setBakgrunnsinformasjon] = useState<
    string | null
  >(deltaker.bakgrunnsinformasjon)
  const [error, setError] = useState<string | null>(null)

  const validertRequest = () => {
    if (
      bakgrunnsinformasjon &&
      bakgrunnsinformasjon.length > bakgrunnsinfoSporsmal.maksTegn
    ) {
      setError(
        `Bakgrunnsinfo kan ikke være mer enn ${bakgrunnsinfoSporsmal.maksTegn} tegn.`
      )
      return null
    }

    if (!bakgrunnsinformasjon || bakgrunnsinformasjon.trim().length === 0) {
      setError('Bakgrunnsinfo må fylles ut.')
      return null
    }

    validerDeltakerKanEndres(deltaker)
    if (bakgrunnsinformasjon === deltaker.bakgrunnsinformasjon) {
      throw new Error(getFeilmeldingIngenEndringTekst(false))
    }

    return {
      deltakerId: deltaker.deltakerId,
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
      deltaker={deltaker}
      onClose={onClose}
      onSend={onSuccess}
      apiFunction={endreDeltakelseBakgrunnsinfo}
      validertRequest={validertRequest}
      forslag={null}
    >
      <>
        {deltaker.importertFraArena && !deltaker.bakgrunnsinformasjon && (
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
            setBakgrunnsinformasjon(fjernUgyldigeTegn(e.target.value))
          }}
          label={bakgrunnsinfoSporsmal.label}
          description={bakgrunnsinfoSporsmal.description}
          value={bakgrunnsinformasjon ?? ''}
          maxLength={bakgrunnsinfoSporsmal.maksTegn}
          id="bakgrunnsinformasjon"
          size="small"
          aria-label={'Bakgrunnsinfo'}
          error={error}
          disabled={!deltaker.erUnderOppfolging}
        />
      </>
    </Endringsmodal>
  )
}
