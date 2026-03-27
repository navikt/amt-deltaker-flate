import {
  CheckmarkCircleIcon,
  ExclamationmarkTriangleIcon,
  XMarkOctagonIcon
} from '@navikt/aksel-icons'
import { Checkbox, CheckboxGroup, InfoCard } from '@navikt/ds-react'

import { ReactNode } from 'react'

interface Props {
  title: string
  size: 'small' | 'medium'
  checkboxLabel: string
  isConfirmed: boolean
  error?: string
  onConfirmedChange: (confirmed: boolean) => void
  children: ReactNode
}

export const ConfirmInfoCard = ({
  title,
  size,
  checkboxLabel,
  isConfirmed,
  error,
  onConfirmedChange,
  children
}: Props) => {
  return (
    <InfoCard
      size={size}
      data-color={error ? 'danger' : isConfirmed ? 'success' : 'warning'}
    >
      <InfoCard.Header
        icon={
          error ? (
            <XMarkOctagonIcon aria-hidden />
          ) : isConfirmed ? (
            <CheckmarkCircleIcon aria-hidden />
          ) : (
            <ExclamationmarkTriangleIcon aria-hidden />
          )
        }
      >
        <InfoCard.Title>{title}</InfoCard.Title>
      </InfoCard.Header>

      <InfoCard.Content>
        {children}

        <CheckboxGroup
          legend={title}
          hideLegend
          error={error}
          onChange={(val: string[]) =>
            onConfirmedChange(val.includes('confirmed'))
          }
        >
          <Checkbox value="confirmed">{checkboxLabel}</Checkbox>
        </CheckboxGroup>
      </InfoCard.Content>
    </InfoCard>
  )
}
