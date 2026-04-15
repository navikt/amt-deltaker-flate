interface Props {
  className?: string
}

export const HorisontalLine = ({ className }: Props) => (
  <div
    className={`h-px w-full bg-(--ax-border-neutral-subtle) ${className ?? ''}`}
  />
)
