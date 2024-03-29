import { BodyLong, HStack, Heading, List, Link, Label, BodyShort } from '@navikt/ds-react'
import {
  getDeltakerStatusAarsakText,
  hentTiltakNavnHosArrangørTekst
} from '../../utils/displayText.ts'
import { Todo } from '../Todo.tsx'
import { ChevronRightIcon } from '@navikt/aksel-icons'
import { usePameldingCOntext } from './PameldingContext.tsx'
import { DeltakerIStatusTag } from '../DeltakerIStatusTag.tsx'
import { EMDASH, INNHOLD_TYPE_ANNET, formatDateFromString } from '../../utils/utils.ts'
import { DeltakerStatusType } from '../../api/data/pamelding.ts'
import { HvaErDette } from './HvaErDette.tsx'

interface Props {
  className: string
}

export const DeltakerInfo = ({ className }: Props) => {
  const { pamelding } = usePameldingCOntext()
  const tiltakOgStedTekst = hentTiltakNavnHosArrangørTekst(
    pamelding.deltakerliste.tiltakstype,
    pamelding.deltakerliste.arrangorNavn
  )
  const skalViseDato =
    pamelding.status.type !== DeltakerStatusType.IKKE_AKTUELL &&
    pamelding.status.type !== DeltakerStatusType.AVBRUTT_UTKAST
  const bakgrunsinformasjon =
    pamelding.bakgrunnsinformasjon && pamelding.bakgrunnsinformasjon.length > 0
      ? pamelding.bakgrunnsinformasjon
      : EMDASH

  let dato = EMDASH
  if (
    pamelding.startdato &&
    pamelding.sluttdato &&
    pamelding.startdato !== EMDASH &&
    pamelding.sluttdato !== EMDASH
  ) {
    dato = `${formatDateFromString(pamelding.startdato)} - ${formatDateFromString(pamelding.sluttdato)}`
  } else if (pamelding.startdato && pamelding.startdato !== EMDASH) {
    dato = formatDateFromString(pamelding.startdato)
  }

  return (
    <div className={`bg-white px-12 py-4 ${className}`}>
      <Heading level="1" size="large">
        {tiltakOgStedTekst}
      </Heading>

      <HStack gap="2" className="mt-8">
        <Label>Status:</Label>
        <DeltakerIStatusTag statusType={pamelding.status.type} />
      </HStack>
      {pamelding.status.aarsak && (
        <HStack gap="2" className="mt-4">
          <Label>Årsak:</Label>
          <BodyShort>{getDeltakerStatusAarsakText(pamelding.status.aarsak)}</BodyShort>
        </HStack>
      )}
      {skalViseDato && (
        <HStack gap="2" className="mt-4">
          <Label>{pamelding.startdato && !pamelding.sluttdato ? 'Oppstartsdato:' : 'Dato:'}</Label>
          <BodyShort>{dato}</BodyShort>
        </HStack>
      )}
      <BodyLong size="small" className="mt-4">
        {`Du er meldt på arbeidsmarkedstiltaket: ${tiltakOgStedTekst}. Når arrangøren har en ledig plass så vil de ta kontakt med deg for å avklare oppstart.`}
      </BodyLong>

      <Heading level="2" size="medium" className="mt-8">
        Hva er innholdet?
      </Heading>
      <BodyLong className="mt-4" size="small">
        {pamelding.deltakelsesinnhold?.ledetekst ?? ''}
      </BodyLong>
      {pamelding.deltakelsesinnhold && (
        <List as="ul" size="small" className="mt-4">
          {pamelding.deltakelsesinnhold.innhold
            .filter((i) => i.valgt)
            .map((i) => (
              <List.Item key={i.innholdskode}>
                {i.innholdskode === INNHOLD_TYPE_ANNET ? i.beskrivelse : i.tekst}
              </List.Item>
            ))}
        </List>
      )}
      <div>
        <Heading level="2" size="medium" className="mt-8">
          Bakgrunnsinfo
        </Heading>
        <BodyLong size="small" className="mt-2">
          {bakgrunsinformasjon}
        </BodyLong>

        <Link href="#" className="mt-8">
          <Todo /> Se endringer
          <span>
            <ChevronRightIcon title="Gå til side for endringer" />
          </span>
        </Link>

        <div className="mt-8">
          <Todo />
          Send en melding her til NAV-veilederen din hvis noe skal endres.
        </div>

        <HvaErDette vedtaksinformasjon={pamelding.vedtaksinformasjon} className="mt-8" />

        <Heading level="2" size="medium" className="mt-8">
          Du har rett til å klage
        </Heading>
        <BodyLong size="small" className="mt-1">
          Du kan klage hvis du ikke ønsker å delta, er uenig i endringer på deltakelsen eller du
          ønsker et annet arbeidsmarkedstiltak. Fristen for å klage er seks uker etter du mottok
          informasjonen. Les mer om
          {
            <Link href="#">
              <Todo />
              retten til å klage her.
            </Link>
          }
        </BodyLong>
      </div>
    </div>
  )
}
