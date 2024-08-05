import dayjs from 'dayjs'
import {
  DeltakerHistorikk,
  DeltakerlisteStatus,
  DeltakerStatusType,
  EMDASH,
  EndringType,
  ForslagEndring,
  ForslagEndringAarsakType,
  HistorikkType,
  INNHOLD_TYPE_ANNET,
  Tiltakstype
} from 'deltaker-flate-common'
import { HttpResponse } from 'msw'
import { v4 as uuidv4 } from 'uuid'
import {
  AvsluttDeltakelseRequest,
  EndreBakgrunnsinfoRequest,
  EndreDeltakelsesmengdeRequest,
  EndreInnholdRequest,
  EndreSluttarsakRequest,
  EndreSluttdatoRequest,
  EndreStartdatoRequest,
  ForlengDeltakelseRequest,
  IkkeAktuellRequest
} from '../api/data/endre-deltakelse-request.ts'
import { PameldingResponse } from '../api/data/pamelding.ts'
import { SendInnPameldingRequest } from '../api/data/send-inn-pamelding-request.ts'
import { SendInnPameldingUtenGodkjenningRequest } from '../api/data/send-inn-pamelding-uten-godkjenning-request.ts'
import {
  AktivtForslag,
  ForslagEndringType,
  ForslagStatusType
} from 'deltaker-flate-common'

const harVedtak = (statusType: DeltakerStatusType) => {
  return (
    statusType !== DeltakerStatusType.KLADD &&
    statusType !== DeltakerStatusType.UTKAST_TIL_PAMELDING &&
    statusType !== DeltakerStatusType.AVBRUTT_UTKAST
  )
}

const createHistorikk = (): DeltakerHistorikk => {
  return [
    {
      type: HistorikkType.Endring,
      endring: {
        type: EndringType.EndreBakgrunnsinformasjon,
        bakgrunnsinformasjon: null
      },
      endretAv: 'Navn Navnesen',
      endretAvEnhet: 'NAV Fredrikstad',
      endret: dayjs().subtract(2, 'day').toDate()
    },
    {
      type: HistorikkType.Vedtak,
      fattet: dayjs().toDate(),
      bakgrunnsinformasjon: 'Bakgrunnsinformasjon',
      fattetAvNav: true,
      deltakelsesinnhold: {
        ledetekst:
          'Du får tett oppfølging og støtte av en veileder. Sammen kartlegger dere hvordan din kompetanse, interesser og ferdigheter påvirker muligheten din til å jobbe.',
        innhold: [
          {
            tekst: 'Støtte til jobbsøking',
            innholdskode: 'type1',
            valgt: true,
            beskrivelse: null
          }
        ]
      },
      opprettetAv: 'Navn Navnesen',
      opprettetAvEnhet: 'NAV Fredrikstad',
      opprettet: dayjs().subtract(3, 'day').toDate()
    }
  ]
}

export class MockHandler {
  pamelding: PameldingResponse | null = null
  deltakerIdNotAllowedToDelete = 'b21654fe-f0e6-4be1-84b5-da72ad6a4c0c'
  statusType = DeltakerStatusType.KLADD
  innhold = [
    {
      tekst: 'Støtte til jobbsøking',
      innholdskode: 'type1',
      valgt: false,
      beskrivelse: null
    },
    {
      tekst: 'Karriereveiledning',
      innholdskode: 'type2',
      valgt: false,
      beskrivelse: null
    },
    {
      tekst: 'Kartlegge hvordan helsen din påvirker muligheten din til å jobbe',
      innholdskode: 'type3',
      valgt: false,
      beskrivelse: null
    },
    {
      tekst:
        'Kartlegge hvilken støtte og tilpasning du trenger på arbeidsplassen',
      innholdskode: 'type4',
      valgt: false,
      beskrivelse: null
    },
    {
      tekst: 'Kartlegge dine forventninger til å jobbe',
      innholdskode: 'type5',
      valgt: false,
      beskrivelse: null
    },
    {
      tekst: 'Veiledning i sosial mestring',
      innholdskode: 'type6',
      valgt: false,
      beskrivelse: null
    },
    {
      tekst: 'Hjelp til å tilpasse arbeidsoppgaver og arbeidsplassen',
      innholdskode: 'type7',
      valgt: false,
      beskrivelse: null
    },
    {
      tekst: 'Veiledning til arbeidsgiver',
      innholdskode: 'type8',
      valgt: false,
      beskrivelse: null
    },
    {
      tekst: 'Oppfølging på arbeidsplassen',
      innholdskode: 'type9',
      valgt: true,
      beskrivelse: null
    },
    {
      tekst: 'Arbeidspraksis',
      innholdskode: 'type10',
      valgt: false,
      beskrivelse: null
    },
    {
      tekst: 'Annet',
      innholdskode: INNHOLD_TYPE_ANNET,
      valgt: true,
      beskrivelse: 'Ønsker å kartlegge arbeidspraksis \nTeste ulike verktøy'
    }
  ]

  createDeltaker(
    deltakerlisteId: string,
    startdato?: Date,
    sluttdato?: Date,
    maxVarighetMnd?: number,
    softMaxVarighetMnd?: number
  ): PameldingResponse {
    const yesterday = dayjs().subtract(1, 'day')
    const today = dayjs()

    const _startdato = startdato ? dayjs(startdato).toString() : null
    const _sluttdato = sluttdato ? dayjs(sluttdato).toString() : null

    return {
      deltakerId: uuidv4(),
      fornavn: 'Navn',
      mellomnavn: null,
      etternavn: 'Naversen',
      deltakerliste: {
        deltakerlisteId: deltakerlisteId,
        deltakerlisteNavn: 'Testliste',
        tiltakstype: Tiltakstype.ARBFORB,
        arrangorNavn: 'Den Beste Arrangøren AS',
        oppstartstype: 'LOPENDE',
        startdato: '2022-10-28',
        sluttdato: '2030-02-20',
        status: DeltakerlisteStatus.GJENNOMFORES,
        tilgjengeligInnhold: this.innhold.map((i) => ({
          tekst: i.tekst,
          innholdskode: i.innholdskode
        }))
      },
      status: {
        id: '85a05446-7211-4bbc-88ad-970f7ef9fb04',
        type: this.statusType,
        aarsak: null,
        gyldigFra: dayjs().subtract(17, 'day').toString(),
        gyldigTil: EMDASH,
        opprettet: yesterday.toString()
      },
      startdato: _startdato,
      sluttdato: _sluttdato,
      dagerPerUke: null,
      deltakelsesprosent: 100,
      bakgrunnsinformasjon:
        'Ønsker å bli kontaktet via sms\nKan ikke på onsdager',
      deltakelsesinnhold: {
        ledetekst:
          'Du får tett oppfølging og støtte av en veileder. Sammen Kartlegger dere hvordan din kompetanse, interesser og ferdigheter påvirker muligheten din til å jobbe.',
        innhold: this.innhold
      },
      vedtaksinformasjon: {
        fattet: harVedtak(this.statusType) ? yesterday.toString() : null,
        fattetAvNav: false,
        opprettet: yesterday.toString(),
        opprettetAv: 'Navn Navnesen',
        sistEndret: today.toString(),
        sistEndretAv: 'Navn Navnesen',
        sistEndretAvEnhet: 'NAV Fredrikstad'
      },
      adresseDelesMedArrangor: true,
      kanEndres: true,
      digitalBruker: true,
      maxVarighet: dayjs
        .duration(maxVarighetMnd ?? 12, 'month')
        .asMilliseconds(),
      softMaxVarighet: dayjs
        .duration(softMaxVarighetMnd ?? 6, 'month')
        .asMilliseconds(),
      forslag: []
    }
  }

  createPamelding(deltakerlisteId: string): HttpResponse {
    this.pamelding = this.createDeltaker(deltakerlisteId)
    return HttpResponse.json(this.pamelding)
  }

  getStartdato(): string {
    if (
      this.statusType === DeltakerStatusType.DELTAR ||
      this.statusType === DeltakerStatusType.HAR_SLUTTET
    ) {
      const passertDato = new Date()
      passertDato.setDate(passertDato.getDate() - 15)
      return dayjs(passertDato).format('YYYY-MM-DD')
    }
    return EMDASH
  }

  getSluttdato(): string {
    if (this.statusType === DeltakerStatusType.DELTAR) {
      const fremtidigDato = new Date()
      fremtidigDato.setDate(fremtidigDato.getDate() + 10)
      return dayjs(fremtidigDato).format('YYYY-MM-DD')
    }
    if (this.statusType === DeltakerStatusType.HAR_SLUTTET) {
      const passertDato = new Date()
      passertDato.setDate(passertDato.getDate() - 10)
      return dayjs(passertDato).format('YYYY-MM-DD')
    }
    return EMDASH
  }

  getForslag(): AktivtForslag[] {
    if (this.statusType === DeltakerStatusType.DELTAR) {
      const sluttdato = dayjs(this.pamelding?.sluttdato)
        .add(3, 'months')
        .format('YYYY-MM-DD')

      const startdato = dayjs(this.pamelding?.startdato)
        .add(1, 'week')
        .format('YYYY-MM-DD')

      const forslag = aktivtForslag({
        begrunnelse:
          'Vi har kommet i gang, men ser at det er hensiktsmessig ' +
          'å fortsette tett oppfølging nå når han er i gang med å kontakte de riktige arbeidsgiverne. ' +
          'nå er det totalt sett to hundre tegn. Ja, det er det..',
        endring: {
          type: ForslagEndringType.ForlengDeltakelse,
          sluttdato: sluttdato
        }
      })
      const forslagAvslutt = aktivtForslag({
        begrunnelse: null,
        endring: {
          type: ForslagEndringType.AvsluttDeltakelse,
          sluttdato: sluttdato,
          aarsak: {
            type: ForslagEndringAarsakType.Syk
          }
        }
      })
      const forslagDeltakelsesmengde = aktivtForslag({
        endring: {
          type: ForslagEndringType.Deltakelsesmengde,
          deltakelsesprosent: 42,
          dagerPerUke: 3
        }
      })
      const forslagStartdato = aktivtForslag({
        endring: {
          type: ForslagEndringType.Startdato,
          startdato: startdato,
          sluttdato: sluttdato
        }
      })
      return [
        forslagStartdato,
        forslagDeltakelsesmengde,
        forslag,
        forslagAvslutt
      ]
    }
    if (this.statusType === DeltakerStatusType.VENTER_PA_OPPSTART) {
      const forslagIkkeAktuell = aktivtForslag({
        endring: {
          type: ForslagEndringType.IkkeAktuell,
          aarsak: {
            type: ForslagEndringAarsakType.Annet,
            beskrivelse: 'Fordi...'
          }
        }
      })
      return [forslagIkkeAktuell]
    }
    if (this.statusType === DeltakerStatusType.HAR_SLUTTET) {
      const sluttdatoForslag = aktivtForslag({
        endring: {
          type: ForslagEndringType.Sluttdato,
          sluttdato: dayjs(this.pamelding?.sluttdato)
            .add(7, 'days')
            .toISOString()
        }
      })
      const sluttarsakForslag = aktivtForslag({
        endring: {
          type: ForslagEndringType.Sluttarsak,
          aarsak: {
            type: ForslagEndringAarsakType.Annet,
            beskrivelse: 'Fordi...'
          }
        }
      })
      return [sluttarsakForslag, sluttdatoForslag]
    }
    return []
  }

  deletePamelding(deltakerId: string): HttpResponse {
    if (deltakerId === this.deltakerIdNotAllowedToDelete) {
      return new HttpResponse(null, { status: 400 })
    }

    if (this.pamelding?.deltakerId === deltakerId) {
      this.pamelding = null
      return new HttpResponse(null, { status: 200 })
    }

    return new HttpResponse(null, { status: 404 })
  }

  sendInnPamelding(
    deltakerId: string,
    request: SendInnPameldingRequest
  ): HttpResponse {
    // eslint-disable-next-line no-console
    console.log(deltakerId, request)
    if (this.pamelding === null) return new HttpResponse(null, { status: 404 })

    this.pamelding.bakgrunnsinformasjon = request.bakgrunnsinformasjon || null
    this.pamelding.dagerPerUke = request.dagerPerUke || null
    this.pamelding.deltakelsesprosent = request.deltakelsesprosent || null
    if (this.pamelding.deltakelsesinnhold !== null) {
      this.pamelding.deltakelsesinnhold.innhold =
        this.pamelding.deltakelsesinnhold.innhold.map((i) => {
          const valgtInnhold = request.innhold.reduce(
            (acc, innhold) => {
              acc[innhold.innholdskode] = innhold
              return acc
            },
            {} as Record<string, (typeof request.innhold)[0]>
          )

          if (valgtInnhold[i.innholdskode] !== undefined) {
            i.valgt = true
            i.beskrivelse = valgtInnhold[i.innholdskode].beskrivelse
          } else {
            i.valgt = false
          }
          return i
        })
    }
    return HttpResponse.json(this.pamelding)
  }

  sendInnPameldingUtenGodkjenning(
    deltakerId: string,
    request: SendInnPameldingUtenGodkjenningRequest
  ): HttpResponse {
    // eslint-disable-next-line no-console
    console.log(deltakerId, request)
    return new HttpResponse(null, { status: 200 })
  }

  setStatus(status: DeltakerStatusType) {
    this.statusType = status
    const oppdatertPamelding = this.pamelding

    if (oppdatertPamelding) {
      if (status === DeltakerStatusType.FEILREGISTRERT) {
        oppdatertPamelding.kanEndres = false
      } else {
        oppdatertPamelding.kanEndres = true
      }

      if (harVedtak(status) && oppdatertPamelding.vedtaksinformasjon) {
        oppdatertPamelding.vedtaksinformasjon.fattet = dayjs()
          .subtract(2, 'day')
          .toString()
      } else if (oppdatertPamelding.vedtaksinformasjon) {
        oppdatertPamelding.vedtaksinformasjon.fattet = null
      }
      oppdatertPamelding.status.type = status
      oppdatertPamelding.startdato = this.getStartdato()
      oppdatertPamelding.sluttdato = this.getSluttdato()
      oppdatertPamelding.forslag = this.getForslag()
      this.pamelding = oppdatertPamelding
      return HttpResponse.json(oppdatertPamelding)
    }
    return HttpResponse.json(this.pamelding)
  }

  endreDeltakelseIkkeAktuell(request: IkkeAktuellRequest) {
    const oppdatertPamelding = this.pamelding

    if (oppdatertPamelding) {
      oppdatertPamelding.status.type = DeltakerStatusType.IKKE_AKTUELL
      oppdatertPamelding.status.aarsak = request.aarsak
      oppdatertPamelding.startdato = null
      oppdatertPamelding.sluttdato = null
      this.fjernAktivtForslag(request.forslagId)
      this.pamelding = oppdatertPamelding
      return HttpResponse.json(oppdatertPamelding)
    }

    return new HttpResponse(null, { status: 404 })
  }

  endreDeltakelseReaktiver() {
    const oppdatertPamelding = this.pamelding

    if (oppdatertPamelding) {
      oppdatertPamelding.status.type = DeltakerStatusType.VENTER_PA_OPPSTART
      oppdatertPamelding.startdato = null
      oppdatertPamelding.sluttdato = null
      this.pamelding = oppdatertPamelding
      return HttpResponse.json(oppdatertPamelding)
    }

    return new HttpResponse(null, { status: 404 })
  }

  endreDeltakelseForleng(request: ForlengDeltakelseRequest) {
    const oppdatertPamelding = this.pamelding

    if (oppdatertPamelding) {
      oppdatertPamelding.sluttdato = request.sluttdato
      this.fjernAktivtForslag(request.forslagId)
      this.pamelding = oppdatertPamelding
      return HttpResponse.json(oppdatertPamelding)
    }

    return new HttpResponse(null, { status: 404 })
  }

  endreDeltakelseStartdato(request: EndreStartdatoRequest) {
    const oppdatertPamelding = this.pamelding

    if (oppdatertPamelding) {
      oppdatertPamelding.startdato = request.startdato
      oppdatertPamelding.sluttdato = request.sluttdato
      this.pamelding = oppdatertPamelding
      this.fjernAktivtForslag(request.forslagId)
      return HttpResponse.json(oppdatertPamelding)
    }

    return new HttpResponse(null, { status: 404 })
  }

  endreDeltakelseBakgrunnsinfo(request: EndreBakgrunnsinfoRequest) {
    const oppdatertPamelding = this.pamelding

    if (oppdatertPamelding) {
      oppdatertPamelding.bakgrunnsinformasjon = request.bakgrunnsinformasjon
      this.pamelding = oppdatertPamelding
      return HttpResponse.json(oppdatertPamelding)
    }

    return new HttpResponse(null, { status: 404 })
  }

  endreDeltakelseSluttdato(request: EndreSluttdatoRequest) {
    const oppdatertPamelding = this.pamelding

    if (oppdatertPamelding) {
      oppdatertPamelding.sluttdato = request.sluttdato
      this.pamelding = oppdatertPamelding
      this.fjernAktivtForslag(request.forslagId)
      return HttpResponse.json(oppdatertPamelding)
    }

    return new HttpResponse(null, { status: 404 })
  }

  avsluttDeltakelse(request: AvsluttDeltakelseRequest) {
    const oppdatertPamelding = this.pamelding

    if (oppdatertPamelding) {
      if (request.harDeltatt === false) {
        oppdatertPamelding.status.type = DeltakerStatusType.IKKE_AKTUELL
        oppdatertPamelding.status.aarsak = request.aarsak
        oppdatertPamelding.startdato = null
        oppdatertPamelding.sluttdato = null
      } else {
        oppdatertPamelding.status.type = DeltakerStatusType.HAR_SLUTTET
        oppdatertPamelding.status.aarsak = request.aarsak
        oppdatertPamelding.sluttdato = request.sluttdato
      }
      this.fjernAktivtForslag(request.forslagId)
      this.pamelding = oppdatertPamelding
      return HttpResponse.json(oppdatertPamelding)
    }

    return new HttpResponse(null, { status: 404 })
  }

  endreDeltakelseSluttarsak(request: EndreSluttarsakRequest) {
    const oppdatertPamelding = this.pamelding

    if (oppdatertPamelding) {
      oppdatertPamelding.status.type = DeltakerStatusType.HAR_SLUTTET
      oppdatertPamelding.status.aarsak = request.aarsak
      this.pamelding = oppdatertPamelding
      this.fjernAktivtForslag(request.forslagId)
      return HttpResponse.json(oppdatertPamelding)
    }

    return new HttpResponse(null, { status: 404 })
  }

  endreDeltakelseInnhold(request: EndreInnholdRequest) {
    const oppdatertPamelding = this.pamelding

    if (oppdatertPamelding && oppdatertPamelding.deltakelsesinnhold) {
      const nyListe = oppdatertPamelding.deltakelsesinnhold.innhold.map((i) => {
        const nyInnhold = request.innhold.find(
          (vi) => vi.innholdskode === i.innholdskode
        )
        if (nyInnhold) {
          return { ...i, valgt: true, beskrivelse: nyInnhold.beskrivelse }
        } else {
          return { ...i, valgt: false }
        }
      })
      oppdatertPamelding.deltakelsesinnhold.innhold = nyListe
      this.pamelding = oppdatertPamelding
      return HttpResponse.json(this.pamelding)
    }

    return new HttpResponse(null, { status: 404 })
  }

  endreDeltakelsesmengde(request: EndreDeltakelsesmengdeRequest) {
    const oppdatertPamelding = this.pamelding

    if (oppdatertPamelding) {
      oppdatertPamelding.deltakelsesprosent = request.deltakelsesprosent || null
      oppdatertPamelding.dagerPerUke = request.dagerPerUke || null
      this.pamelding = oppdatertPamelding
      this.fjernAktivtForslag(request.forslagId)
      return HttpResponse.json(this.pamelding)
    }

    return new HttpResponse(null, { status: 404 })
  }

  avvisForslag(forslagId: string) {
    if (this.pamelding) {
      this.fjernAktivtForslag(forslagId)
      return HttpResponse.json(this.pamelding)
    }

    return new HttpResponse(null, { status: 404 })
  }

  fjernAktivtForslag(id: string | null | undefined) {
    if (id && this.pamelding) {
      this.pamelding.forslag = this.pamelding.forslag.filter((f) => f.id !== id)
    }
  }

  getHistorikk() {
    return HttpResponse.json(createHistorikk())
  }
}

const defaultBegrunnnelseTekst =
  'Endringen her er veldig viktig fordi at det...'

function aktivtForslag({
  endring,
  begrunnelse
}: {
  endring: ForslagEndring
  begrunnelse?: string | null
}): AktivtForslag {
  const b = begrunnelse === undefined ? defaultBegrunnnelseTekst : begrunnelse

  return {
    id: uuidv4(),
    opprettet: dayjs().format('YYYY-MM-DD'),
    begrunnelse: b,
    endring: endring,
    status: {
      type: ForslagStatusType.VenterPaSvar
    }
  }
}
