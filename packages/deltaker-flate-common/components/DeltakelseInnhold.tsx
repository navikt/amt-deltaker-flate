import { BodyLong, List } from '@navikt/ds-react'
import { Deltakelsesinnhold, Innhold, Tiltakskode } from '../model/deltaker'
import { INNHOLD_TYPE_ANNET } from '../utils/constants'
import { erOpplaringstiltak } from '../utils/utils'
import { FlattKodeverk, OpplaringRepresenterer } from '../model/kodeverk'

interface Props {
  deltakelsesinnhold: Deltakelsesinnhold | null
  kodeverk?: FlattKodeverk | null
  tiltakskode: Tiltakskode
  heading: React.ReactNode | null
  listClassName?: string
}

export const DeltakelseInnhold = ({
  deltakelsesinnhold,
  kodeverk,
  tiltakskode,
  heading
}: Props) => {
  if (!harInnhold(deltakelsesinnhold)) {
    if (!harKodeverk(kodeverk)) {
      return null
    }

    return (
      <div className="flex flex-col gap-2">
        {heading ?? null}

        {renderKodeverk(kodeverk)}
      </div>
    )
  }

  const harInnholdsTekst =
    tiltakskode === Tiltakskode.VARIG_TILRETTELAGT_ARBEID_SKJERMET ||
    tiltakskode === Tiltakskode.VARIG_TILRETTELAGT_ARBEID_ORDINAER ||
    erOpplaringstiltak(tiltakskode)

  const annetFelt: Innhold | undefined = getAnnetFeltForInnhold(
    harInnholdsTekst,
    deltakelsesinnhold
  )

  if (harInnholdsTekst && !annetFelt && !harKodeverk(kodeverk)) {
    return null
  }

  return (
    <div className="flex flex-col gap-2">
      {heading ?? null}

      {deltakelsesinnhold.ledetekst && (
        <BodyLong size="small">{deltakelsesinnhold.ledetekst}</BodyLong>
      )}

      {harInnholdsTekst && annetFelt && (
        <BodyLong
          className="whitespace-pre-wrap"
          key={annetFelt.innholdskode}
          size="small"
        >
          {annetFelt.beskrivelse}
        </BodyLong>
      )}

      {renderKodeverk(kodeverk)}

      {!harInnholdsTekst && deltakelsesinnhold.innhold.length > 0 && (
        <List as="ul" size="small">
          {deltakelsesinnhold.innhold
            .filter((i) => i.valgt)
            .map((i) => (
              <List.Item key={i.innholdskode} className="whitespace-pre-wrap">
                {i.innholdskode === INNHOLD_TYPE_ANNET
                  ? i.beskrivelse
                  : i.tekst}
              </List.Item>
            ))}
        </List>
      )}
    </div>
  )
}

const renderKodeverk = (kodeverk: FlattKodeverk | null | undefined) => {
  const kodeverkTekst = getKodeverkTekst(kodeverk)
  const kodeverkForListe = (kodeverk?.valgteKategoriseringer ?? []).filter(
    (e) =>
      e.representerer !== OpplaringRepresenterer.BRANSJE_ID &&
      e.representerer !== OpplaringRepresenterer.UTDANNINGSPROGRAM_ID &&
      e.representerer !== OpplaringRepresenterer.KURSTYPE_ID &&
      e.valg.length > 0
  )
  const valgteSertifiseringer = kodeverk?.valgteSertifiseringer ?? []
  const visListe =
    kodeverkForListe.length > 0 || valgteSertifiseringer.length > 0

  return (
    <>
      {kodeverkTekst && <BodyLong size="small">{kodeverkTekst}</BodyLong>}

      {visListe && (
        <List as="ul" size="small">
          {kodeverkForListe.map((e) =>
            e.valg.map((valg) => (
              <List.Item key={valg.id}>{valg.visningsnavn}</List.Item>
            ))
          )}
          {valgteSertifiseringer.map((s) => (
            <List.Item key={s.id}>{s.navn}</List.Item>
          ))}
        </List>
      )}
    </>
  )
}

const getKodeverkTekst = (kodeverk: FlattKodeverk | null | undefined) => {
  return kodeverk?.valgteKategoriseringer.filter(
    (e) =>
      e.representerer === OpplaringRepresenterer.BRANSJE_ID ||
      e.representerer === OpplaringRepresenterer.UTDANNINGSPROGRAM_ID
  )[0]?.valg[0]?.visningsnavn
}

const getAnnetFeltForInnhold = (
  harInnholdsTekst: boolean,
  deltakelsesinnhold: Deltakelsesinnhold
): Innhold | undefined => {
  if (!harInnholdsTekst) {
    return undefined
  }
  return deltakelsesinnhold.innhold.find(
    (i) => i.innholdskode === INNHOLD_TYPE_ANNET && i.valgt
  )
}

const harInnhold = (
  deltakelsesinnhold: Deltakelsesinnhold | null
): deltakelsesinnhold is Deltakelsesinnhold => {
  return (
    !!deltakelsesinnhold &&
    (deltakelsesinnhold.innhold.length > 0 || !!deltakelsesinnhold.ledetekst)
  )
}

const harKodeverk = (kodeverk: FlattKodeverk | null | undefined): boolean =>
  !!kodeverk &&
  (kodeverk.valgteKategoriseringer.length > 0 ||
    kodeverk.valgteSertifiseringer.length > 0)
