import { BodyShort, Label } from '@navikt/ds-react'
import {
  DeltakerStatusTag,
  EMDASH,
  formatDate,
  getDeltakerStatusAarsakText,
  mapTiltakskodeTilArenaTiltakskode,
  SeEndringer,
  Tiltakskode
} from 'deltaker-flate-common'
import { getDeltakerHistorikk } from '../../api/api'
import { DeltakerDetaljer as DeltakerDetaljerDomene } from '../../api/data/deltaker'
import { Vurdering } from '../Vurdering'
import { DeltakerEndringer } from './DeltakerEndringer'

interface Props {
  deltaker: DeltakerDetaljerDomene | null
}

export const DeltakerDetaljer = ({ deltaker }: Props) => {
  if (!deltaker) {
    return null
  }

  const visVurdering =
    deltaker.tiltakskode === Tiltakskode.GRUPPE_ARBEIDSMARKEDSOPPLAERING ||
    deltaker.tiltakskode === Tiltakskode.GRUPPE_FAG_OG_YRKESOPPLAERING

  return (
    <div className="flex flex-col mb-4">
      <div className="flex flex-col pb-6 h-fit gap-4 w-full border-b border-[var(--a-border-divider)] mb-4">
        <Detail title="Status">
          <DeltakerStatusTag statusType={deltaker.status.type} />
        </Detail>
        {deltaker.status.aarsak && (
          <div className="flex gap-2" aria-atomic>
            <Detail title="Årsak">
              <BodyShort as="span" className="whitespace-pre-wrap">
                {getDeltakerStatusAarsakText(deltaker.status.aarsak)}
              </BodyShort>
            </Detail>
          </div>
        )}

        {visVurdering && (
          <Detail title="Vurdering, arrangør">
            {deltaker.vurdering ? (
              <div className="flex flex-col gap-2">
                <Vurdering vurdering={deltaker.vurdering.type} />
                {deltaker.vurdering.begrunnelse && (
                  <BodyShort size="small">
                    {deltaker.vurdering.begrunnelse}
                  </BodyShort>
                )}
              </div>
            ) : (
              <BodyShort size="small">{EMDASH}</BodyShort>
            )}
          </Detail>
        )}
        <Detail title="Dato">
          <BodyShort size="small">
            {deltaker.startdato
              ? `${formatDate(deltaker.startdato)} — ${deltaker.sluttdato ? formatDate(deltaker.sluttdato) : ''}`
              : EMDASH}
          </BodyShort>
        </Detail>
      </div>

      <DeltakerEndringer
        forslag={deltaker.aktiveForslag}
        ulesteHendelser={deltaker.ulesteHendelser}
      />

      {deltaker.tilgangTilBruker && (
        <SeEndringer
          className="mt-4 w-fit"
          deltakerId={deltaker.id}
          tiltakstype={mapTiltakskodeTilArenaTiltakskode(deltaker.tiltakskode)}
          fetchHistorikk={getDeltakerHistorikk}
        />
      )}
    </div>
  )
}

interface DetailProps {
  title: string
  children: React.ReactNode
}

const Detail = ({ title, children }: DetailProps) => {
  return (
    <div className="flex gap-2">
      <Label size="small">{title}:</Label>
      {children}
    </div>
  )
}
