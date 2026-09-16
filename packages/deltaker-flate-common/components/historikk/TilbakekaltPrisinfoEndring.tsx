import {
  DeltakerEndring,
  EndrePrisinfoStatus,
  Endring,
  EndringType
} from '../../model/deltakerHistorikk.ts'
import { formatDate } from '../../utils/utils.ts'
import { HistorikkElement } from './HistorikkElement.tsx'
import { getEndringsTittel } from '../../utils/displayText.ts'
import { Detail, ReadMore } from '@navikt/ds-react'

export const erTilbakekaltPrisinfo = (
  endring: Endring
): endring is Extract<Endring, { type: EndringType.EndrePrisinfo }> =>
  endring.type === EndringType.EndrePrisinfo &&
  endring.status === EndrePrisinfoStatus.TILBAKEKALT

export const TilbakekaltPrisinfoEndring = ({
  deltakerEndring,
  erEnkeltplass,
  icon,
  forslag,
  endringsDetaljer
}: {
  deltakerEndring: DeltakerEndring
  erEnkeltplass: boolean
  icon: React.ReactNode
  forslag: DeltakerEndring['forslag']
  endringsDetaljer: React.JSX.Element
}) => {
  const endring = deltakerEndring.endring

  const byline = `Tilbakekalt ${formatDate(deltakerEndring.endret)} av ${deltakerEndring.endretAv} ${deltakerEndring.endretAvEnhet}.`

  return (
    <HistorikkElement
      tittel={getEndringsTittel(endring, erEnkeltplass)}
      icon={icon}
      forslag={forslag}
    >
      <Detail className="mt-1" textColor="subtle">
        {byline}
      </Detail>
      <div className="mt-2">
        <ReadMore size="small" header="Endringen som ble tilbakekalt">
          {endringsDetaljer}
        </ReadMore>
      </div>
    </HistorikkElement>
  )
}
