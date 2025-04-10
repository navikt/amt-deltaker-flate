import {
  CaretRightCircleFillIcon,
  ChevronRightCircleFillIcon,
  ChevronRightDoubleCircleFillIcon,
  ChevronRightLastCircleFillIcon,
  MenuElipsisHorizontalCircleFillIcon,
  MinusCircleFillIcon,
  PieChartFillIcon,
  PlusCircleFillIcon
} from '@navikt/aksel-icons'
import { EndreDeltakelseType } from '../model/endre-deltaker.ts'
import { TiltakskoordinatorEndringsType } from '../model/deltakerHistorikk.ts'

interface EndringTypeIkonProps {
  type: EndreDeltakelseType | TiltakskoordinatorEndringsType
  size?: 'medium' | 'large' | 'small'
}

export const EndringTypeIkon = ({ type, size }: EndringTypeIkonProps) => {
  const sizeName = (size?: 'small' | 'medium' | 'large') => {
    if (size === 'large') {
      return 'h-7 w-7'
    } else if (size === 'small') {
      return 'h-5 w-5'
    } else {
      return 'h-6 w-6'
    }
  }
  switch (type) {
    case EndreDeltakelseType.ENDRE_OPPSTARTSDATO:
      return (
        <ChevronRightCircleFillIcon
          className={sizeName(size)}
          aria-hidden
          color="var(--a-deepblue-300)"
        />
      )
    case EndreDeltakelseType.FORLENG_DELTAKELSE:
      return (
        <ChevronRightDoubleCircleFillIcon
          className={sizeName(size)}
          aria-hidden
          color="var(--a-icon-success)"
        />
      )
    case EndreDeltakelseType.AVSLUTT_DELTAKELSE:
    case EndreDeltakelseType.FJERN_OPPSTARTSDATO:
    case EndreDeltakelseType.ENDRE_SLUTTDATO:
      return (
        <MinusCircleFillIcon
          className={sizeName(size)}
          aria-hidden
          color="var(--a-gray-600)"
        />
      )
    case EndreDeltakelseType.IKKE_AKTUELL:
      return (
        <PlusCircleFillIcon
          className={`${sizeName(size)} rotate-45`}
          aria-hidden
          color="var(--a-orange-600)"
        />
      )
    case EndreDeltakelseType.ENDRE_SLUTTARSAK:
      return (
        <ChevronRightLastCircleFillIcon
          className={sizeName(size)}
          aria-hidden
          color="var(--a-gray-500)"
        />
      )
    case EndreDeltakelseType.ENDRE_BAKGRUNNSINFO:
    case EndreDeltakelseType.ENDRE_INNHOLD:
    case TiltakskoordinatorEndringsType.DelMedArrangor:
    case TiltakskoordinatorEndringsType.SettPaVenteliste:
      return (
        <MenuElipsisHorizontalCircleFillIcon
          className={sizeName(size)}
          aria-hidden
          color="var(--a-deepblue-400)"
        />
      )
    case EndreDeltakelseType.ENDRE_DELTAKELSESMENGDE:
      return (
        <PieChartFillIcon
          className={sizeName(size)}
          aria-hidden
          color="var(--a-purple-500)"
        />
      )
    case EndreDeltakelseType.REAKTIVER_DELTAKELSE:
      return (
        <CaretRightCircleFillIcon
          className={sizeName(size)}
          aria-hidden
          color="var(--a-icon-alt-2)"
        />
      )
  }
}
