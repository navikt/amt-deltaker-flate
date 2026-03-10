import { ChatElipsisIcon } from '@navikt/aksel-icons'
import { LinkCard } from '@navikt/ds-react'

interface Props {
  dialogUrl: string
  className?: string
}

export const DialogLenke = ({ dialogUrl, className }: Props) => {
  return (
    <LinkCard className={`${className ?? ''} `} data-color="neutral">
      <LinkCard.Icon>
        <ChatElipsisIcon className="text-5xl" aria-hidden />
      </LinkCard.Icon>
      <LinkCard.Title>
        <LinkCard.Anchor href={dialogUrl}>
          Har du spørsmål eller ønsker å endre noe
        </LinkCard.Anchor>
      </LinkCard.Title>
      <LinkCard.Description>
        Send en melding til Nav-veilederen din.
      </LinkCard.Description>
    </LinkCard>
  )
}
