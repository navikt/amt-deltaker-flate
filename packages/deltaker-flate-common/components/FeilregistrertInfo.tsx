import { BodyShort, Heading, Label } from '@navikt/ds-react'
import { DeltakerStatusType } from '../model/deltaker'
import { formatDateWithMonthName } from '../utils/utils'
import { DeltakerStatusTag } from './DeltakerStatusTag'
import { DialogLenke } from './DialogLenke'

interface Props {
  className: string
  dialogUrl: string
  tiltakOgStedTekst: string
  meldtPaDato?: Date | null
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
    <div
      className={`bg-(--ax-bg-default) py-4 px-4 ax-md:px-12 ${className ?? ''}`}
    >
      <Heading
        level="1"
        size="large"
        data-testid="heading_feilregistrert_tiltak"
      >
        {tiltakOgStedTekst}
      </Heading>

      <div className="flex gap-2 mt-8">
        <Label>Status:</Label>
        <DeltakerStatusTag statusType={DeltakerStatusType.FEILREGISTRERT} />
      </div>

      <BodyShort className="mt-4">
        Innholdet er slettet av Nav fordi arbeidsmarkedstiltaket ble registrert
        feil.
      </BodyShort>

      {meldtPaDato && (
        <BodyShort className="mt-4">
          {`Meldt på: ${formatDateWithMonthName(meldtPaDato)}`}
        </BodyShort>
      )}

      <BodyShort className="mt-4">
        {`Feilen ble registrert: ${formatDateWithMonthName(feilregistrertDato)}`}
      </BodyShort>

      <DialogLenke dialogUrl={dialogUrl} className="mt-8 mb-4" />
    </div>
  )
}
