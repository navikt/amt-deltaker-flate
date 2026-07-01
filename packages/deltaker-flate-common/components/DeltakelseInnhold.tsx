import { BodyLong, List } from '@navikt/ds-react'
import { Deltakelsesinnhold, Innhold, Tiltakskode } from '../model/deltaker'
import {
  OpplaringKategorisering,
  OpplaringRepresenterer
} from '../model/kodeverk'
import { INNHOLD_TYPE_ANNET } from '../utils/constants'
import { getKodeverkRepresentererTekst } from '../utils/displayText'
import { erOpplaringstiltak } from '../utils/utils'

interface Props {
  deltakelsesinnhold: Deltakelsesinnhold | null
  kodeverk?: OpplaringKategorisering | null
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

        {Kodeverk(kodeverk)}
      </div>
    )
  }

  const harInnholdsTekst =
    tiltakskode === Tiltakskode.VARIG_TILRETTELAGT_ARBEID_SKJERMET ||
    tiltakskode === Tiltakskode.TILRETTELAGT_ARBEID_ORDINAER ||
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

      {Kodeverk(kodeverk)}

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

const Kodeverk = (kodeverk: OpplaringKategorisering | null | undefined) => {
  const kodeverkTekst = getKodeverkTekst(kodeverk)
  const kodeverkForListe = (kodeverk?.valgteKategoriseringer ?? []).filter(
    (e) =>
      e.type !== OpplaringRepresenterer.BRANSJE_ID &&
      e.type !== OpplaringRepresenterer.UTDANNINGSPROGRAM_ID &&
      e.type !== OpplaringRepresenterer.KURSTYPE_ID &&
      e.type.length > 0
  )
  const valgteSertifiseringer = kodeverk?.valgteSertifiseringer ?? []
  const visListe =
    kodeverkForListe.length > 0 || valgteSertifiseringer.length > 0

  const harForerkortEllerSertifisering =
    kodeverkForListe.some((e) => e.type === OpplaringRepresenterer.FORERKORT) ||
    valgteSertifiseringer.length > 0
  const harLærefag = kodeverkForListe.some(
    (e) => e.type === OpplaringRepresenterer.LAREFAG
  )
  const listeprefix = harForerkortEllerSertifisering
    ? 'Førerkort og sertifisering:'
    : harLærefag
      ? 'Lærefag:'
      : null

  return (
    <>
      {kodeverkTekst && <BodyLong size="small">{kodeverkTekst}</BodyLong>}

      {visListe && listeprefix && (
        <BodyLong size="small">{listeprefix}</BodyLong>
      )}

      {visListe && (
        <List as="ul" size="small">
          {kodeverkForListe.map((e) =>
            e.valgteElementer.map((valg) => (
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

const getKodeverkTekst = (
  kodeverk: OpplaringKategorisering | null | undefined
) => {
  const kategorier = kodeverk
    ? kodeverk.valgteKategoriseringer.filter(
        (e) =>
          e.type === OpplaringRepresenterer.BRANSJE_ID ||
          e.type === OpplaringRepresenterer.UTDANNINGSPROGRAM_ID
      )
    : []

  if (kategorier.length === 0 || kategorier[0].valgteElementer.length === 0)
    return null
  const kategori = kategorier[0]

  return `${getKodeverkRepresentererTekst(kategori.type)}: ${kategori.valgteElementer.map((v) => v.visningsnavn).join(', ')}`
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

function harInnhold(
  deltakelsesinnhold: Deltakelsesinnhold | null
): deltakelsesinnhold is Deltakelsesinnhold {
  return (
    !!deltakelsesinnhold &&
    (deltakelsesinnhold.innhold.length > 0 || !!deltakelsesinnhold.ledetekst)
  )
}

function harKodeverk(
  kodeverk: OpplaringKategorisering | null | undefined
): boolean {
  if (!kodeverk) {
    return false
  }

  return (
    kodeverk.valgteKategoriseringer.length > 0 ||
    kodeverk.valgteSertifiseringer.length > 0
  )
}
