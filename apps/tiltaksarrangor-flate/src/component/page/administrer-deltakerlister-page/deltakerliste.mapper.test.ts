import { describe, expect, it } from 'vitest'
import { AdminDeltakerliste } from '../../../api/data/tiltak'
import { deltakerlisteMapper } from './deltakerliste.mapper'

const lagDeltakerliste = (
  endringer: Partial<AdminDeltakerliste> = {}
): AdminDeltakerliste => ({
  id: 'liste-1',
  lopenummer: '2026/1',
  navn: 'Deltakerliste',
  tiltaksnavn: 'Avklaring',
  arrangorNavn: 'Overordnet organisasjon',
  arrangorOrgnummer: '111111111',
  arrangorParentNavn: 'Virksomhet',
  startDato: new Date('2026-01-01'),
  sluttDato: null,
  lagtTil: false,
  oppstartstype: null,
  ...endringer
})

describe('deltakerlisteMapper', () => {
  it('holder virksomheter med samme navn og ulike organisasjonsnumre atskilt', () => {
    const resultat = deltakerlisteMapper([
      lagDeltakerliste(),
      lagDeltakerliste({
        id: 'liste-2',
        arrangorOrgnummer: '222222222'
      })
    ])

    expect(resultat).toHaveLength(1)
    expect(resultat[0].arrangorer).toHaveLength(2)
    expect(
      resultat[0].arrangorer.map(({ id, deltakerlister }) => ({
        id,
        listeIder: deltakerlister.map((liste) => liste.id)
      }))
    ).toEqual([
      { id: '111111111', listeIder: ['liste-1'] },
      { id: '222222222', listeIder: ['liste-2'] }
    ])
  })

  it('samler lister med samme organisasjonsnummer selv om navnene er ulike', () => {
    const resultat = deltakerlisteMapper([
      lagDeltakerliste(),
      lagDeltakerliste({
        id: 'liste-2',
        arrangorParentNavn: 'Oppdatert virksomhetsnavn'
      })
    ])

    expect(resultat[0].arrangorer).toHaveLength(1)
    expect(
      resultat[0].arrangorer[0].deltakerlister.map(({ id }) => id)
    ).toEqual(['liste-1', 'liste-2'])
  })

  it('beholder listefelter og skiller mellom overordnede grupper', () => {
    const liste = lagDeltakerliste()
    const resultat = deltakerlisteMapper([
      liste,
      lagDeltakerliste({
        id: 'liste-2',
        arrangorNavn: 'Annen overordnet organisasjon',
        arrangorOrgnummer: '222222222'
      })
    ])

    expect(resultat.map(({ navn }) => navn)).toEqual([
      'Overordnet organisasjon',
      'Annen overordnet organisasjon'
    ])
    expect(resultat[0].arrangorer[0].deltakerlister).toEqual([
      {
        id: liste.id,
        lopenummer: liste.lopenummer,
        navn: liste.navn,
        tiltaksnavn: liste.tiltaksnavn,
        oppstartstype: liste.oppstartstype,
        startDato: liste.startDato,
        sluttDato: liste.sluttDato
      }
    ])
    expect(deltakerlisteMapper([])).toEqual([])
  })
})
