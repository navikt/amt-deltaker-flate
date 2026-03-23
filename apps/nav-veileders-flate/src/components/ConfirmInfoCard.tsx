import { Checkbox, CheckboxGroup, InfoCard } from '@navikt/ds-react'
import {
  ExclamationmarkTriangleIcon,
  XMarkOctagonIcon
} from '@navikt/aksel-icons'

import { ReactNode } from 'react'

interface Props {
  title: string
  checkboxLabel: string
  isConfirmed: boolean
  error?: string
  onConfirmedChange: (confirmed: boolean) => void
  children: ReactNode
}

export const ConfirmInfoCard = ({
  title,
  checkboxLabel,
  isConfirmed,
  error,
  onConfirmedChange,
  children
}: Props) => {
  return (
    <InfoCard
      data-color={error ? 'danger' : isConfirmed ? 'success' : 'warning'}
    >
      <InfoCard.Header
        icon={
          error ? (
            <XMarkOctagonIcon aria-hidden />
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
