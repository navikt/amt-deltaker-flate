import {
  BodyLong,
  Checkbox,
  CheckboxGroup,
  Heading,
  Textarea
} from '@navikt/ds-react'
import { EndreDeltakelseType, INNHOLD_TYPE_ANNET } from 'deltaker-flate-common'
import { useState } from 'react'
import { useAppContext } from '../../../AppContext'
import { endreDeltakelseInnhold } from '../../../api/api'
import { PameldingResponse } from '../../../api/data/pamelding'
import {
  BESKRIVELSE_ANNET_MAX_TEGN,
  generateValgtInnholdKoder
} from '../../../model/PameldingFormValues'
import { generateInnholdFromResponse } from '../../../utils/pamelding-form-utils'
import { Endringsmodal } from '../modal/Endringsmodal.tsx'
import { EndreInnholdRequest } from '../../../api/data/endre-deltakelse-request.ts'

interface EndreInnholdModalProps {
  pamelding: PameldingResponse
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

export const EndreInnholdModal = ({
  pamelding,
  open,
  onClose,
  onSuccess
}: EndreInnholdModalProps) => {
  const innhold = pamelding.deltakelsesinnhold?.innhold ?? []
  const [valgteInnhold, setValgteInnhold] = useState<string[] | []>(
    generateValgtInnholdKoder(pamelding)
  )
  const [innholdError, setInnholdError] = useState<string | null>(null)
  const { enhetId } = useAppContext()

  const [annetBeskrivelse, setAnnetBeskrivelse] = useState<
    string | null | undefined
  >(
    innhold
      .filter((i) => i.valgt)
      .find((i) => i.innholdskode === INNHOLD_TYPE_ANNET)?.beskrivelse
  )
  const [annetError, setAnnetError] = useState<string | null>(null)

  const harAnnetBeskrivelse = annetBeskrivelse && annetBeskrivelse.length > 0
  const erAnnetValgt =
    valgteInnhold.find((vi) => vi === INNHOLD_TYPE_ANNET) !== undefined

  const validertRequest = () => {
    if (valgteInnhold.length <= 0) {
      setInnholdError('Du må velge innhold før du kan fortsette.')
      return null
    } else if (
      erAnnetValgt &&
      harAnnetBeskrivelse &&
      annetBeskrivelse.length > BESKRIVELSE_ANNET_MAX_TEGN
    ) {
      setAnnetError(
        `Tiltaksinnholdet "Annet" kan ikke være mer enn ${BESKRIVELSE_ANNET_MAX_TEGN} tegn.`
      )
      return null
    } else if (erAnnetValgt && !harAnnetBeskrivelse) {
      setAnnetError(
        'Du må fylle ut for beskrivelse for "annet" før du kan fortsette.'
      )
      return null
    } else {
      const endring: EndreInnholdRequest = {
        innhold: generateInnholdFromResponse(
          pamelding,
          valgteInnhold,
          annetBeskrivelse
        )
      }
      return {
        deltakerId: pamelding.deltakerId,
        enhetId,
        body: endring
      }
    }
  }

  return (
    <Endringsmodal
      open={open}
      endringstype={EndreDeltakelseType.ENDRE_INNHOLD}
      digitalBruker={pamelding.digitalBruker}
      onClose={onClose}
      onSend={onSuccess}
      apiFunction={endreDeltakelseInnhold}
      validertRequest={validertRequest}
      forslag={null}
    >
      <Heading level="2" size="small" className="mb-4">
        Dette er innholdet
      </Heading>
      <section>
        <BodyLong size="small">
          {pamelding.deltakelsesinnhold?.ledetekst ?? ''}
        </BodyLong>
      </section>

      <section className="mt-4">
        {innhold.length > 0 && (
          <CheckboxGroup
            defaultValue={valgteInnhold}
            legend="Hva mer skal tiltaket inneholde?"
            error={innholdError}
            size="small"
            aria-required
            id="endreValgteInnhold"
            onChange={(value: string[]) => {
              setValgteInnhold(value)
              setInnholdError(null)
            }}
          >
            {pamelding.deltakerliste.tilgjengeligInnhold.map((e) => (
              <div key={e.innholdskode}>
                <Checkbox value={e.innholdskode}>{e.tekst}</Checkbox>
                {e.innholdskode === INNHOLD_TYPE_ANNET && erAnnetValgt && (
                  <Textarea
                    onChange={(e) => {
                      setAnnetBeskrivelse(e.target.value)
                      setAnnetError(null)
                    }}
                    label={null}
                    value={annetBeskrivelse ?? ''}
                    aria-label={'Beskrivelse av innhold "Annet"'}
                    aria-required
                    maxLength={BESKRIVELSE_ANNET_MAX_TEGN}
                    size="small"
                    id="innholdAnnetBeskrivelse"
                    error={annetError}
                  />
                )}
              </div>
            ))}
          </CheckboxGroup>
        )}
      </section>
    </Endringsmodal>
  )
}
