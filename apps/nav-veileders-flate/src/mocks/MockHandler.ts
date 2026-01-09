import dayjs from 'dayjs'
import {
  createHistorikk,
  Deltakelsesmengde,
  DeltakerlisteStatus,
  DeltakerStatusAarsakType,
  DeltakerStatusType,
  EMDASH,
  Forslag,
  ForslagEndring,
  ForslagEndringAarsakType,
  ForslagEndringType,
  ForslagStatusType,
  getInnholdForTiltakskode,
  getLedetekst,
  getUtvidetInnhold,
  harBakgrunnsinfo,
  HistorikkType,
  Innhold,
  lagHistorikkFellesOppstart,
  Oppstartstype,
  Pameldingstype,
  Tiltakskode
} from 'deltaker-flate-common'
import { HttpResponse } from 'msw'
import { v4 as uuidv4 } from 'uuid'
import {
  AvsluttDeltakelseRequest,
  EndreAvslutningRequest,
  EndreBakgrunnsinfoRequest,
  EndreDeltakelsesmengdeRequest,
  EndreInnholdRequest,
  EndreSluttarsakRequest,
  EndreStartdatoRequest,
  FjernOppstartsdatoRequest,
  ForlengDeltakelseRequest,
  IkkeAktuellRequest
} from '../api/data/endre-deltakelse-request.ts'
import { PameldingResponse } from '../api/data/pamelding.ts'
import { SendInnPameldingRequest } from '../api/data/send-inn-pamelding-request.ts'

const bakgrunnsinformasjon =
  'Ønsker å bli kontaktet via sms\nKan ikke på onsdager'

const harVedtak = (statusType: DeltakerStatusType) => {
  return (
    statusType !== DeltakerStatusType.KLADD &&
    statusType !== DeltakerStatusType.UTKAST_TIL_PAMELDING &&
    statusType !== DeltakerStatusType.AVBRUTT_UTKAST
  )
}

export class MockHandler {
  pamelding: PameldingResponse | null = null
  deltakerIdNotAllowedToDelete = 'b21654fe-f0e6-4be1-84b5-da72ad6a4c0c'
  statusType = DeltakerStatusType.KLADD
  tiltakskode = Tiltakskode.ARBEIDSFORBEREDENDE_TRENING

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

    const ledetekst = getLedetekst(this.tiltakskode)
    const innhold = getInnholdForTiltakskode(this.tiltakskode)

    const sisteDeltakelsesmengde: Deltakelsesmengde = {
      gyldigFra: startdato ?? new Date(),
      dagerPerUke: null,
      deltakelsesprosent: 100
    }

    return {
      deltakerId: uuidv4(),
      fornavn: 'Navn',
      mellomnavn: null,
      etternavn: 'Naversen',
      deltakerliste: {
        deltakerlisteId: deltakerlisteId,
        deltakerlisteNavn: 'Testliste',
        tiltakskode: this.tiltakskode,
        oppstartstype: Oppstartstype.LOPENDE,
        arrangorNavn: 'Den Beste Arrangøren AS',
        startdato: dayjs('2022-10-28').toDate(),
        sluttdato: dayjs('2030-02-20').toDate(),
        status: DeltakerlisteStatus.GJENNOMFORES,
        tilgjengeligInnhold: {
          innhold: innhold,
          ledetekst: ledetekst
        },
        erEnkeltplassUtenRammeavtale: false,
        pameldingstype: Pameldingstype.DIREKTE_VEDTAK,
        oppmoteSted:
          'Fjordgata 7b, 00 Stedet. Inngangsdør rundt svingen. Oppmøte kl. 09:00. '
      },
      status: {
        id: '85a05446-7211-4bbc-88ad-970f7ef9fb04',
        type: this.statusType,
        aarsak: null,
        gyldigFra: dayjs().subtract(30, 'day').toDate(),
        gyldigTil: null,
        opprettet: dayjs().subtract(30, 'day').toDate()
      },
      startdato: _startdato,
      sluttdato: _sluttdato,
      dagerPerUke: sisteDeltakelsesmengde.dagerPerUke,
      deltakelsesprosent: sisteDeltakelsesmengde.deltakelsesprosent,
      bakgrunnsinformasjon: bakgrunnsinformasjon,
      deltakelsesinnhold: {
        ledetekst: ledetekst,
        innhold: getUtvidetInnhold(innhold)
      },
      vedtaksinformasjon: {
        fattet: harVedtak(this.statusType) ? yesterday.toDate() : null,
        fattetAvNav: false,
        opprettet: yesterday.toDate(),
        opprettetAv: 'Navn Navnesen',
        sistEndret: today.toDate(),
        sistEndretAv: 'Navn Navnesen',
        sistEndretAvEnhet: 'Nav Fredrikstad'
      },
      adresseDelesMedArrangor: true,
      kanEndres: true,
      digitalBruker: true,
      harAdresse: true,
      maxVarighet: dayjs
        .duration(maxVarighetMnd ?? 12, 'month')
        .asMilliseconds(),
      softMaxVarighet: dayjs
        .duration(softMaxVarighetMnd ?? 6, 'month')
        .asMilliseconds(),
      forslag: [],
      importertFraArena: null,
      erUnderOppfolging: true,
      deltakelsesmengder: {
        sisteDeltakelsesmengde,
        nesteDeltakelsesmengde: null
      },
      erManueltDeltMedArrangor: true
    }
  }

  createPamelding(deltakerlisteId: string) {
    this.pamelding = this.createDeltaker(deltakerlisteId)
    return HttpResponse.json(this.pamelding)
  }

  getStartdato(newStatusType?: DeltakerStatusType): string {
    const statusType = newStatusType ?? this.statusType
    if (
      statusType === DeltakerStatusType.DELTAR ||
      statusType === DeltakerStatusType.HAR_SLUTTET ||
      statusType === DeltakerStatusType.FULLFORT ||
      statusType === DeltakerStatusType.AVBRUTT
    ) {
      const passertDato = new Date()
      passertDato.setDate(passertDato.getDate() - 15)
      return dayjs(passertDato).format('YYYY-MM-DD')
    }
    return EMDASH
  }

  getSluttdato(newStatusType?: DeltakerStatusType): string {
    const statusType = newStatusType ?? this.statusType
    if (statusType === DeltakerStatusType.DELTAR) {
      const fremtidigDato = new Date()
      fremtidigDato.setDate(fremtidigDato.getDate() + 10)
      return dayjs(fremtidigDato).format('YYYY-MM-DD')
    }
    if (
      statusType === DeltakerStatusType.HAR_SLUTTET ||
      statusType === DeltakerStatusType.FULLFORT ||
      statusType === DeltakerStatusType.AVBRUTT
    ) {
      const passertDato = new Date()
      passertDato.setDate(passertDato.getDate() - 10)
      return dayjs(passertDato).format('YYYY-MM-DD')
    }
    return EMDASH
  }

  getForslag(): Forslag[] {
    const erFellesOppstart =
      this.pamelding?.deltakerliste.oppstartstype === Oppstartstype.FELLES
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
          sluttdato: dayjs(sluttdato).toDate()
        }
      })
      const forslagAvslutt = aktivtForslag({
        begrunnelse: null,
        endring: {
          type: ForslagEndringType.AvsluttDeltakelse,
          sluttdato: dayjs(sluttdato).toDate(),
          aarsak: {
            type: ForslagEndringAarsakType.Syk
          },
          harDeltatt: true,
          harFullfort: null
        }
      })
      const forslagAvslutt2 = aktivtForslag({
        begrunnelse: null,
        endring: {
          type: ForslagEndringType.AvsluttDeltakelse,
          sluttdato: dayjs(sluttdato).toDate(),
          aarsak: null,
          harDeltatt: true,
          harFullfort: true
        }
      })
      const forslagDeltakelsesmengde = aktivtForslag({
        endring: {
          type: ForslagEndringType.Deltakelsesmengde,
          deltakelsesprosent: 42,
          dagerPerUke: 3,
          gyldigFra: new Date()
        }
      })
      const forslagStartdato = aktivtForslag({
        endring: {
          type: ForslagEndringType.Startdato,
          startdato: dayjs(startdato).toDate(),
          sluttdato: dayjs(sluttdato).toDate()
        }
      })
      const forslagIkkeAktuell = aktivtForslag({
        endring: {
          type: ForslagEndringType.IkkeAktuell,
          aarsak: {
            type: ForslagEndringAarsakType.Annet,
            beskrivelse: 'Fordi...'
          }
        }
      })
      const avvisForslag = erFellesOppstart
        ? [forslagAvslutt2]
        : [forslagAvslutt]
      return [
        forslagStartdato,
        forslagDeltakelsesmengde,
        forslag,
        ...avvisForslag,
        forslagIkkeAktuell
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
      const forslagFjernOppstartsdato = aktivtForslag({
        endring: {
          type: ForslagEndringType.FjernOppstartsdato
        },
        begrunnelse: 'Begrunnelse'
      })
      return [forslagIkkeAktuell, forslagFjernOppstartsdato]
    }
    if (this.statusType === DeltakerStatusType.HAR_SLUTTET) {
      const sluttdatoForslag = aktivtForslag({
        endring: {
          type: ForslagEndringType.Sluttdato,
          sluttdato: dayjs(this.pamelding?.sluttdato).add(7, 'days').toDate()
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

  deletePamelding(deltakerId: string) {
    if (deltakerId === this.deltakerIdNotAllowedToDelete) {
      return new HttpResponse(null, { status: 400 })
    }

    if (this.pamelding?.deltakerId === deltakerId) {
      this.pamelding = null
      return new HttpResponse(null, { status: 200 })
    }

    return new HttpResponse(null, { status: 404 })
  }

  sendInnPamelding(request: SendInnPameldingRequest) {
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
          .toDate()
      } else if (oppdatertPamelding.vedtaksinformasjon) {
        oppdatertPamelding.vedtaksinformasjon.fattet = null
      }
      oppdatertPamelding.status.type = status
      if (status === DeltakerStatusType.AVBRUTT_UTKAST) {
        oppdatertPamelding.status.aarsak = {
          type: DeltakerStatusAarsakType.SAMARBEIDET_MED_ARRANGOREN_ER_AVBRUTT,
          beskrivelse: null
        }
      } else if (status === DeltakerStatusType.AVBRUTT) {
        oppdatertPamelding.status.aarsak = {
          type: DeltakerStatusAarsakType.FATT_JOBB,
          beskrivelse: null
        }
      } else if (status === DeltakerStatusType.IKKE_AKTUELL) {
        oppdatertPamelding.status.aarsak = {
          type: DeltakerStatusAarsakType.ANNET,
          beskrivelse: 'Det er en annen grunn'
        }
      } else {
        oppdatertPamelding.status.aarsak = null
      }
      oppdatertPamelding.startdato = this.getStartdato(status)
      oppdatertPamelding.sluttdato = this.getSluttdato(status)
      oppdatertPamelding.forslag = this.getForslag()
      this.pamelding = oppdatertPamelding
      return HttpResponse.json(oppdatertPamelding)
    }
    return HttpResponse.json(this.pamelding)
  }

  setTiltakskode(tiltakskode: Tiltakskode) {
    this.tiltakskode = tiltakskode
    const oppdatertPamelding = this.pamelding
    const erEnkeltplassFraArena =
      tiltakskode === Tiltakskode.ENKELTPLASS_ARBEIDSMARKEDSOPPLAERING ||
      tiltakskode === Tiltakskode.ENKELTPLASS_FAG_OG_YRKESOPPLAERING ||
      tiltakskode === Tiltakskode.HOYERE_UTDANNING

    if (oppdatertPamelding) {
      oppdatertPamelding.deltakerliste.tiltakskode = tiltakskode

      const ledetekst = getLedetekst(tiltakskode)
      const innhold = getInnholdForTiltakskode(tiltakskode)
      oppdatertPamelding.deltakerliste.tilgjengeligInnhold = {
        innhold,
        ledetekst
      }
      oppdatertPamelding.deltakelsesinnhold = {
        innhold: getUtvidetInnhold(innhold),
        ledetekst
      }

      if (
        tiltakskode === Tiltakskode.ARBEIDSFORBEREDENDE_TRENING ||
        tiltakskode === Tiltakskode.VARIG_TILRETTELAGT_ARBEID_SKJERMET
      ) {
        oppdatertPamelding.deltakelsesprosent = 80
        oppdatertPamelding.dagerPerUke = 4
      } else {
        oppdatertPamelding.deltakelsesprosent = null
        oppdatertPamelding.dagerPerUke = null
      }
      if (harBakgrunnsinfo(tiltakskode)) {
        oppdatertPamelding.bakgrunnsinformasjon = null
      } else {
        oppdatertPamelding.bakgrunnsinformasjon = bakgrunnsinformasjon
      }

      if (erEnkeltplassFraArena) {
        oppdatertPamelding.deltakerliste.erEnkeltplassUtenRammeavtale = true
        oppdatertPamelding.forslag = []
        oppdatertPamelding.importertFraArena = {
          innsoktDato: dayjs().subtract(20, 'day').toDate()
        }
      } else {
        oppdatertPamelding.importertFraArena = null
        oppdatertPamelding.deltakerliste.erEnkeltplassUtenRammeavtale = false
      }

      this.pamelding = oppdatertPamelding
    }
    return HttpResponse.json(this.pamelding)
  }

  setOppstartstype(oppstartstype: Oppstartstype) {
    const oppdatertPamelding = this.pamelding

    if (oppdatertPamelding) {
      oppdatertPamelding.deltakerliste.oppstartstype = oppstartstype
      this.pamelding = oppdatertPamelding
    }
    return HttpResponse.json(this.pamelding)
  }

  setPameldingstype(pameldingstype: Pameldingstype) {
    const oppdatertPamelding = this.pamelding

    if (oppdatertPamelding) {
      oppdatertPamelding.deltakerliste.pameldingstype = pameldingstype
      this.pamelding = oppdatertPamelding
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

  endreDeltakelseFjernOppstartsdato(request: FjernOppstartsdatoRequest) {
    const oppdatertPamelding = this.pamelding

    if (oppdatertPamelding) {
      oppdatertPamelding.startdato = null
      oppdatertPamelding.sluttdato = null
      this.pamelding = oppdatertPamelding
      this.fjernAktivtForslag(request.forslagId)
      return HttpResponse.json(oppdatertPamelding)
    }

    return new HttpResponse(null, { status: 404 })
  }

  avsluttDeltakelse(request: AvsluttDeltakelseRequest) {
    const oppdatertPamelding = this.pamelding
    const oppstartstype = oppdatertPamelding?.deltakerliste.oppstartstype

    if (oppdatertPamelding) {
      if (request.harDeltatt === false) {
        oppdatertPamelding.status.type = DeltakerStatusType.IKKE_AKTUELL
        oppdatertPamelding.status.aarsak = request.aarsak
        oppdatertPamelding.startdato = null
        oppdatertPamelding.sluttdato = null
      } else {
        if (oppstartstype === Oppstartstype.FELLES) {
          oppdatertPamelding.status.type = request.harFullfort
            ? DeltakerStatusType.FULLFORT
            : DeltakerStatusType.AVBRUTT
        } else {
          oppdatertPamelding.status.type = DeltakerStatusType.HAR_SLUTTET
        }
        oppdatertPamelding.status.aarsak = request.aarsak
        oppdatertPamelding.sluttdato = request.sluttdato
      }
      this.fjernAktivtForslag(request.forslagId)
      this.pamelding = oppdatertPamelding
      return HttpResponse.json(oppdatertPamelding)
    }

    return new HttpResponse(null, { status: 404 })
  }

  endreAvslutning(request: EndreAvslutningRequest) {
    const oppdatertPamelding = this.pamelding

    if (oppdatertPamelding) {
      if (request.harDeltatt === false) {
        oppdatertPamelding.status.type = DeltakerStatusType.IKKE_AKTUELL
        oppdatertPamelding.status.aarsak = request.aarsak
        oppdatertPamelding.startdato = null
        oppdatertPamelding.sluttdato = null
      } else {
        oppdatertPamelding.status.type = request.harFullfort
          ? DeltakerStatusType.FULLFORT
          : DeltakerStatusType.AVBRUTT
        oppdatertPamelding.status.aarsak = request.aarsak
        oppdatertPamelding.sluttdato = request.sluttdato ?? null
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

    if (oppdatertPamelding) {
      const nyListe: Innhold[] =
        oppdatertPamelding.deltakerliste.tilgjengeligInnhold.innhold.map(
          (i) => {
            const nyInnhold = request.innhold.find(
              (vi) => vi.innholdskode === i.innholdskode
            )
            if (nyInnhold) {
              return {
                innholdskode: i.innholdskode,
                tekst: i.tekst,
                valgt: true,
                beskrivelse: nyInnhold.beskrivelse
              }
            } else {
              return {
                innholdskode: i.innholdskode,
                tekst: i.tekst,
                valgt: false,
                beskrivelse: null
              }
            }
          }
        )
      oppdatertPamelding.deltakelsesinnhold = {
        ledetekst:
          oppdatertPamelding.deltakerliste.tilgjengeligInnhold.ledetekst,
        innhold: nyListe
      }
      this.pamelding = oppdatertPamelding
      return HttpResponse.json(this.pamelding)
    }

    return new HttpResponse(null, { status: 404 })
  }

  endreDeltakelsesmengde(request: EndreDeltakelsesmengdeRequest) {
    const oppdatertPamelding = this.pamelding

    if (oppdatertPamelding) {
      const nesteDeltakelsesmengde =
        oppdatertPamelding.deltakelsesmengder.nesteDeltakelsesmengde
      const gyldigFra = dayjs(request.gyldigFra).toDate()
      if (gyldigFra <= new Date()) {
        oppdatertPamelding.deltakelsesprosent =
          request.deltakelsesprosent || null
        oppdatertPamelding.dagerPerUke = request.dagerPerUke || null
      } else if (
        nesteDeltakelsesmengde === null ||
        gyldigFra <= nesteDeltakelsesmengde.gyldigFra
      ) {
        if (
          request.dagerPerUke != oppdatertPamelding.dagerPerUke ||
          request.deltakelsesprosent != oppdatertPamelding.deltakelsesprosent
        ) {
          oppdatertPamelding.deltakelsesmengder.nesteDeltakelsesmengde = {
            gyldigFra: gyldigFra,
            deltakelsesprosent: request.deltakelsesprosent ?? 100,
            dagerPerUke: request.dagerPerUke ?? null
          }
        } else {
          oppdatertPamelding.deltakelsesmengder.nesteDeltakelsesmengde = null
        }
      }
      oppdatertPamelding.deltakelsesmengder.sisteDeltakelsesmengde = {
        gyldigFra: gyldigFra,
        deltakelsesprosent: request.deltakelsesprosent ?? 100,
        dagerPerUke: request.dagerPerUke ?? null
      }
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
    return HttpResponse.json(
      this.pamelding?.deltakerliste.oppstartstype === Oppstartstype.FELLES
        ? lagHistorikkFellesOppstart()
        : createHistorikk()
    )
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
}): Forslag {
  const b = begrunnelse === undefined ? defaultBegrunnnelseTekst : begrunnelse

  return {
    type: HistorikkType.Forslag,
    id: uuidv4(),
    opprettet: dayjs().subtract(20, 'days').toDate(),
    begrunnelse: b,
    endring: endring,
    arrangorNavn: 'Muligheter As',
    status: {
      type: ForslagStatusType.VenterPaSvar
    }
  }
}
