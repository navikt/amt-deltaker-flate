import { ChatElipsisIcon } from '@navikt/aksel-icons'
import { BodyShort, HStack, Heading, Label, LinkPanel } from '@navikt/ds-react'
import { DeltakerStatusType } from '../model/deltaker'
import { formatDateWithMonthName } from '../utils/utils'
import { DeltakerStatusTag } from './DeltakerStatusTag'

interface Props {
  className: string
  dialogUrl: string
  tiltakOgStedTekst: string
  meldtPaDato?: Date
  feilregistrertDato?: Date
}

export const FeilregistrertInfo = ({
  className,
  dialogUrl,
  tiltakOgStedTekst,
  meldtPaDato,
  feilregistrertDato
}: Props) => {
  return (
    <div className={`bg-white py-4 px-4 md:px-12 ${className ?? ''}`}>
      <Heading
        level="1"
        size="large"
        data-testid="heading_feilregistrert_tiltak"
      >
        {tiltakOgStedTekst}
      </Heading>

      <HStack gap="2" className="mt-8">
        <Label>Status:</Label>
        <DeltakerStatusTag statusType={DeltakerStatusType.FEILREGISTRERT} />
      </HStack>

      <BodyShort className="mt-4">
        Innholdet er slettet av Nav fordi arbeidsmarkedstiltaket ble registrert
        feil.
      </BodyShort>

      <BodyShort className="mt-4">
        {`Meldt på: ${formatDateWithMonthName(meldtPaDato)}`}
      </BodyShort>

      <BodyShort className="mt-4">
        {`Feilen ble registrert: ${formatDateWithMonthName(feilregistrertDato)}`}
      </BodyShort>

      <LinkPanel href={dialogUrl} className="mt-8 mb-4 rounded-lg">
        <div className="grid grid-flow-col items-center gap-4">
          <ChatElipsisIcon className="text-2xl" />
          <span>
            Send en melding her til Nav-veilederen din hvis du har spørsmål.
          </span>
        </div>
      </LinkPanel>
    </div>
  )
}
