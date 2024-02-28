interface Props {
  className?: string
}

export const HorisontalLine = ({ className }: Props) => (
  <div className={`bg-black h-px w-full border ${className ?? ''}`} />
)
