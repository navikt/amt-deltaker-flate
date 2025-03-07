import { ChatElipsisIcon } from '@navikt/aksel-icons'
import { LinkPanel } from '@navikt/ds-react'

interface Props {
  dialogUrl: string
  className?: string
}

export const DialogLenke = ({ dialogUrl, className }: Props) => {
  return (
    <LinkPanel href={dialogUrl} className={`${className ?? ''} rounded-lg`}>
      <div className="grid grid-flow-col items-center gap-4">
        <ChatElipsisIcon className="text-2xl" aria-hidden />
        <span>
          Send en melding her til Nav-veilederen din hvis du har spørsmål eller
          hvis noe skal endres.
        </span>
      </div>
    </LinkPanel>
  )
}
