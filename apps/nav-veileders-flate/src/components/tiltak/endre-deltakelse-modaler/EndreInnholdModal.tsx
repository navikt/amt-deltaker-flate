import {
  BodyLong,
  Checkbox,
  CheckboxGroup,
  Heading,
  Textarea
} from '@navikt/ds-react'
import {
  EndreDeltakelseType,
  fjernUgyldigeTegn,
  haveSameContents,
  Innhold,
  INNHOLD_TYPE_ANNET,
  Tiltakstype
} from 'deltaker-flate-common'
import { useState } from 'react'
import { useAppContext } from '../../../AppContext'
import { endreDeltakelseInnhold } from '../../../api/api'
import { EndreInnholdRequest } from '../../../api/data/endre-deltakelse-request.ts'
import { PameldingResponse } from '../../../api/data/pamelding'
import {
  BESKRIVELSE_ANNET_MAX_TEGN,
  generateValgtInnholdKoder
} from '../../../model/PameldingFormValues'
import {
  getFeilmeldingIngenEndring,
  getFeilmeldingIngenEndringTekst
} from '../../../utils/displayText.ts'
import { generateInnholdFromResponse } from '../../../utils/pamelding-form-utils'
import { Endringsmodal } from '../modal/Endringsmodal.tsx'
import { validerDeltakerKanEndres } from '../../../utils/endreDeltakelse.ts'

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

  const [annetBeskrivelse, setAnnetBeskrivelse] = useState<string | null>(
    getAnnetBeskrivelseFraInnhold(innhold)
  )
  const [innholdsTekst, setInnholdsTekst] = useState<string | null>(
    getAnnetBeskrivelseFraInnhold(innhold)
  )
  const [annetError, setAnnetError] = useState<string | null>(null)
  const [innholdsTekstError, setInnholdsTekstError] = useState<string | null>(
    null
  )

  const harAnnetBeskrivelse = annetBeskrivelse && annetBeskrivelse.length > 0
  const erAnnetValgt =
    valgteInnhold.find((vi) => vi === INNHOLD_TYPE_ANNET) !== undefined

  const visCheckbokser =
    pamelding.deltakerliste.tiltakstype !== Tiltakstype.VASV

  const validertRequest = () => {
    if (visCheckbokser && valgteInnhold.length <= 0) {
      setInnholdError('Du må velge innhold før du kan fortsette.')
      return null
    } else if (
      visCheckbokser &&
      erAnnetValgt &&
      harAnnetBeskrivelse &&
      annetBeskrivelse.length > BESKRIVELSE_ANNET_MAX_TEGN
    ) {
      setAnnetError(
        `Tiltaksinnholdet "Annet" kan ikke være mer enn ${BESKRIVELSE_ANNET_MAX_TEGN} tegn.`
      )
      return null
    } else if (visCheckbokser && erAnnetValgt && !harAnnetBeskrivelse) {
      setAnnetError(
        'Du må fylle ut for beskrivelse for "annet" før du kan fortsette.'
      )
      return null
    } else if (
      !visCheckbokser &&
      innholdsTekst &&
      innholdsTekst.length > BESKRIVELSE_ANNET_MAX_TEGN
    ) {
      setInnholdsTekstError(
        `Tiltaksinnholdet kan ikke være mer enn ${BESKRIVELSE_ANNET_MAX_TEGN} tegn.`
      )
      return null
    } else {
      validerDeltakerKanEndres(pamelding)
      if (
        (visCheckbokser &&
          haveSameContents(
            valgteInnhold,
            generateValgtInnholdKoder(pamelding)
          ) &&
          annetBeskrivelse === getAnnetBeskrivelseFraInnhold(innhold)) ||
        (!visCheckbokser &&
          innholdsTekst === getAnnetBeskrivelseFraInnhold(innhold))
      ) {
        throw new Error(
          pamelding.deltakerliste.tiltakstype === Tiltakstype.VASV
            ? getFeilmeldingIngenEndringTekst(false)
            : getFeilmeldingIngenEndring(false)
        )
      }

      const endring: EndreInnholdRequest = {
        innhold: generateInnholdFromResponse(
          pamelding,
          valgteInnhold,
          annetBeskrivelse,
          innholdsTekst
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
      harAdresse={pamelding.harAdresse}
      onClose={onClose}
      onSend={onSuccess}
      apiFunction={endreDeltakelseInnhold}
      validertRequest={validertRequest}
      forslag={null}
      erUnderOppfolging={pamelding.erUnderOppfolging}
    >
      <Heading level="2" size="small" className="mb-4">
        Dette er innholdet
      </Heading>
      <section>
        {pamelding.deltakerliste.tilgjengeligInnhold?.ledetekst && (
          <BodyLong size="small">
            {pamelding.deltakerliste.tilgjengeligInnhold.ledetekst}
          </BodyLong>
        )}
      </section>

      <section className="mt-4">
        {visCheckbokser && (
          <CheckboxGroup
            defaultValue={valgteInnhold}
            legend="Hva mer skal tiltaket inneholde?"
            error={innholdError}
            size="small"
            disabled={!pamelding.erUnderOppfolging}
            aria-required
            id="endreValgteInnhold"
            onChange={(value: string[]) => {
              setValgteInnhold(value)
              setInnholdError(null)
            }}
          >
            {pamelding.deltakerliste.tilgjengeligInnhold.innhold.map((e) => (
              <div key={e.innholdskode}>
                <Checkbox value={e.innholdskode}>{e.tekst}</Checkbox>
                {e.innholdskode === INNHOLD_TYPE_ANNET && erAnnetValgt && (
                  <Textarea
                    onChange={(e) => {
                      setAnnetBeskrivelse(fjernUgyldigeTegn(e.target.value))
                      setAnnetError(null)
                    }}
                    label={null}
                    value={annetBeskrivelse ?? ''}
                    aria-label={'Beskrivelse av innhold "Annet"'}
                    aria-required
                    disabled={!pamelding.erUnderOppfolging}
                    maxLength={BESKRIVELSE_ANNET_MAX_TEGN}
                    size="small"
                    error={annetError}
                  />
                )}
              </div>
            ))}
          </CheckboxGroup>
        )}

        {!visCheckbokser && (
          <Textarea
            onChange={(e) => {
              setInnholdsTekst(fjernUgyldigeTegn(e.target.value))
              setInnholdsTekstError(null)
            }}
            label="Her kan du beskrive hva slags arbeidsoppgaver ol. tiltaket kan inneholde (valgfritt)"
            value={innholdsTekst ?? ''}
            disabled={!pamelding.erUnderOppfolging}
            maxLength={BESKRIVELSE_ANNET_MAX_TEGN}
            size="small"
            error={innholdsTekstError}
          />
        )}
      </section>
    </Endringsmodal>
  )
}

const getAnnetBeskrivelseFraInnhold = (innhold: Innhold[]) => {
  const annetBeskrivelse = innhold
    .filter((i) => i.valgt)
    .find((i) => i.innholdskode === INNHOLD_TYPE_ANNET)?.beskrivelse
  return annetBeskrivelse ?? null
}
