import { EyeSlashIcon, ShieldLockIcon } from '@navikt/aksel-icons'
import { Tooltip } from '@navikt/ds-react'
import { Beskyttelsesmarkering } from '../api/data/deltakerliste'

interface Props {
  beskyttelsesmarkering: Beskyttelsesmarkering[]
}
export function BeskyttelsesmarkeringIkoner({ beskyttelsesmarkering }: Props) {
  if (beskyttelsesmarkering.length === 0) {
    return <></>
  }

  return (
    <div className="flex gap-2">
      {beskyttelsesmarkering.map((b) => (
        <BeskyttelsesmarkeringIkon key={b} beskyttelsesmarkering={b} />
      ))}
    </div>
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
      <ShieldLockIcon className="text-ax-text-warning-decoration" />
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
          <EyeSlashIcon className="text-ax-text-info-decoration" />
        </Tooltip>
      )
    default:
      throw new Error(
        `Ikon for beskyttelsesmarkering ${beskyttelsesmarkering} er ikke implementert`
      )
  }
}
