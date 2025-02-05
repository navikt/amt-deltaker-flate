import { HStack, Tooltip } from '@navikt/ds-react'
import { Beskyttelsesmarkering } from '../api/data/deltakerliste'
import { EyeSlashIcon, ShieldLockIcon } from '@navikt/aksel-icons'

interface Props {
  beskyttelsesmarkering: Beskyttelsesmarkering[]
}
export function BeskyttelsesmarkeringIkoner({ beskyttelsesmarkering }: Props) {
  if (beskyttelsesmarkering.length === 0) {
    return <></>
  }

  return (
    <HStack>
      {beskyttelsesmarkering.map((b) => (
        <BeskyttelsesmarkeringIkon key={b} beskyttelsesmarkering={b} />
      ))}
    </HStack>
  )
}

interface BeskyttelsesmarkeringIkonProps {
  beskyttelsesmarkering: Beskyttelsesmarkering
}
function BeskyttelsesmarkeringIkon({
  beskyttelsesmarkering
}: BeskyttelsesmarkeringIkonProps) {
  const graderingsIkon = (title: string) => (
    <Tooltip content={title}>
      <ShieldLockIcon className="text-icon-warning" />
    </Tooltip>
  )

  switch (beskyttelsesmarkering) {
    case Beskyttelsesmarkering.FORTROLIG:
      return graderingsIkon('Fortrolig adresse')
    case Beskyttelsesmarkering.STRENGT_FORTROLIG:
      return graderingsIkon('Strengt fortrolig adresse')
    case Beskyttelsesmarkering.STRENGT_FORTROLIG_UTLAND:
      return graderingsIkon('Strengt fortrolig adresse utland')
    case Beskyttelsesmarkering.SKJERMET:
      return (
        <Tooltip content="Skjermet">
          <EyeSlashIcon className="text-icon-info" />
        </Tooltip>
      )
    default:
      throw new Error(
        `Ikon for beskyttelsesmarkering ${beskyttelsesmarkering} er ikke implementert`
      )
  }
}
