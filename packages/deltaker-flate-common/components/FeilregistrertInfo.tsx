import { ChatElipsisIcon } from '@navikt/aksel-icons'
import { BodyShort, HStack, Heading, Label, LinkPanel } from '@navikt/ds-react'
import { DeltakerStatusType, Vedtaksinformasjon } from '../model/deltaker'
import { formatDateStrWithMonthName } from '../utils/utils'
import { DeltakerStatusTag } from './DeltakerStatusTag'

interface Props {
  className: string
  dialogUrl: string
  tiltakOgStedTekst: string
  vedtaksinformasjon: Vedtaksinformasjon
  feilregistrertDato: Date
}

export const FeilregistrertInfo = ({
  className,
  dialogUrl,
  tiltakOgStedTekst,
  vedtaksinformasjon
}: Props) => {
  return (
    <div className={`bg-white px-12 py-4 ${className}`}>
      <Heading level="1" size="large">
        {tiltakOgStedTekst}
      </Heading>

      <HStack gap="2" className="mt-8">
        <Label>Status:</Label>
        <DeltakerStatusTag statusType={DeltakerStatusType.FEILREGISTRERT} />
      </HStack>

      <BodyShort>
        Innholdet er slettet av NAV fordi arbeidsmarkedstiltaket ble registrert
        feil.
      </BodyShort>

      <BodyShort className="mt-2">
        {`Meldt på: ${formatDateStrWithMonthName(vedtaksinformasjon.fattet)}`}
      </BodyShort>

      <BodyShort className="mt-2">
        {`Feilen ble registrert: ${formatDateStrWithMonthName(vedtaksinformasjon.fattet)}`}
      </BodyShort>

      <LinkPanel href={dialogUrl} className="mt-8 rounded-lg">
        <div className="grid grid-flow-col items-center gap-4">
          <ChatElipsisIcon className="text-2xl" />
          <span>
            Send en melding her til NAV-veilederen din hvis du har spørsmål.
          </span>
        </div>
      </LinkPanel>
    </div>
  )
}
