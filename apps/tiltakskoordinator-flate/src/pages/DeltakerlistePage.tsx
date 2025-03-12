import { useEffect, useRef } from 'react'
import { DeltakerlisteDetaljer } from '../components/DeltakerlisteDetaljer'
import { DeltakerlisteTabell } from '../components/DeltakerlisteTabell'

export const DeltakerlistePage = () => {
  document.title = 'Deltakerliste'
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.focus()
    }
  }, [])

  return (
    <div className="flex flex-row gap-16 p-4" data-testid="page_deltakerliste">
      <h2 className="sr-only" tabIndex={-1} ref={headingRef}>
        Deltakerliste - detaljer
      </h2>
      <DeltakerlisteDetaljer />
      <h2 className="sr-only">Deltakerliste</h2>
      <DeltakerlisteTabell />
    </div>
  )
}
