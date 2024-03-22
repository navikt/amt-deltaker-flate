import { EndreDeltakelseType } from '../../api/data/endre-deltakelse-request'
import {
  MinusCircleFillIcon,
  ChevronRightDoubleCircleFillIcon,
  ChevronRightCircleFillIcon,
  PlusCircleFillIcon,
  ChevronRightLastCircleFillIcon,
  MenuElipsisHorizontalCircleFillIcon, PieChartFillIcon
} from '@navikt/aksel-icons'

interface EndringTypeIkonProps {
  type: EndreDeltakelseType
}

export const EndringTypeIkon = ({ type }: EndringTypeIkonProps) => {
  switch (type) {
    case EndreDeltakelseType.ENDRE_OPPSTARTSDATO:
      return (
        <ChevronRightCircleFillIcon className="h-6 w-6" aria-hidden color="var(--a-deepblue-300)" />
      )
    case EndreDeltakelseType.FORLENG_DELTAKELSE:
      return (
        <ChevronRightDoubleCircleFillIcon
          className="h-6 w-6"
          aria-hidden
          color="var(--a-icon-success)"
        />
      )
    case EndreDeltakelseType.AVSLUTT_DELTAKELSE:
    case EndreDeltakelseType.ENDRE_SLUTTDATO:
      return <MinusCircleFillIcon className="h-6 w-6" aria-hidden color="var(--a-gray-600)" />
    case EndreDeltakelseType.IKKE_AKTUELL:
      return (
        <PlusCircleFillIcon
          className="h-6 w-6 rotate-45 "
          aria-hidden
          color="var(--a-orange-600)"
        />
      )
    case EndreDeltakelseType.ENDRE_SLUTTARSAK:
      return (
        <ChevronRightLastCircleFillIcon className="h-6 w-6" aria-hidden color="var(--a-gray-500)" />
      )
    case EndreDeltakelseType.ENDRE_BAKGRUNNSINFO:
    case EndreDeltakelseType.ENDRE_INNHOLD:
      return (
        <MenuElipsisHorizontalCircleFillIcon
          className="h-6 w-6"
          aria-hidden
          color="var(--a-deepblue-400)"
        />
      )
    case EndreDeltakelseType.ENDRE_DELTAKELSESMENGDE:
      return (
        <PieChartFillIcon
          className="h-6 w-6"
          aria-hidden
          color="var(--a-purple-500)"
        />
      )
  }
}
