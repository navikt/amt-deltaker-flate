import dayjs from 'dayjs'
import {
  createHistorikk,
  DeltakerStatusAarsakType,
  DeltakerStatusType,
  Forslag,
  ForslagEndring,
  ForslagEndringAarsakType,
  ForslagEndringType,
  ForslagStatusType,
  getDateFromString,
  getInnholdForTiltakskode,
  getLedetekst,
  getUtvidetInnhold,
  harBakgrunnsinfo,
  HistorikkType,
  Innhold,
  INNHOLD_TYPE_ANNET,
  lagHistorikkFellesOppstart,
  mockVisningsnavn,
  Oppstartstype,
  Pameldingstype,
  PrisinformasjonType,
  Tiltakskode
} from 'deltaker-flate-common'
import { HttpResponse } from 'msw'
import { v4 as uuidv4 } from 'uuid'
import { DeltakerResponse } from '../api/data/deltaker.ts'
import {
  AvsluttDeltakelseRequest,
  EndreAvslutningRequest,
  EndreBakgrunnsinfoRequest,
  EndreDeltakelsesmengdeRequest,
  EndreInnholdOpplaringKategoriseringRequest,
  EndreInnholdRequest,
  EndrePrisinfoRequest,
  EndreSluttarsakRequest,
  EndreStartdatoRequest,
  FjernOppstartsdatoRequest,
  ForlengDeltakelseRequest,
  IkkeAktuellRequest
} from '../api/data/endre-deltakelse-request.ts'
import { EnkeltplassPameldingRequest } from '../api/data/enkeltplass-pamelding.ts'
import { EnkeltplassKladdRequest } from '../api/data/kladd-request.ts'
import { KodeverkResponse } from '../api/data/kodeverk.ts'
import { PameldingRequest } from '../api/data/send-pamelding.ts'
import {
  mockArrangorenheter,
  mockBakgrunnsinformasjon,
  mockDelesAdresseMedArrangor,
  mockDeltakere,
  mockHarVedtak
} from './mockDeltakere.ts'
import {
  lagOpplaringKategoriseringDeltaljertRespons,
  lagOpplaringKategoriseringResponse,
  mockSertifiseringer
} from './mockKodeverk.ts'

// Sett valgtMockDeltaker til defaultDeltaker før push.
const valgtMockDeltaker = mockDeltakere().enkeltplassUtenRammeavtale_deltar

export class MockHandler {
  deltaker: DeltakerResponse = structuredClone(valgtMockDeltaker)
  deltakerIdNotAllowedToDelete = 'b21654fe-f0e6-4be1-84b5-da72ad6a4c0c'

  get statusType() {
    return this.deltaker.status.type
  }

  get tiltakskode() {
    return this.deltaker.deltakerliste.tiltakskode.kode
  }

  createPamelding(deltakerlisteId: string) {
    this.deltaker ??= structuredClone(valgtMockDeltaker)
    this.deltaker.deltakerliste.deltakerlisteId = deltakerlisteId
    return HttpResponse.json(this.deltaker)
  }

  createEnkeltplassPamelding(tiltakskode: Tiltakskode) {
    this.deltaker ??= structuredClone(valgtMockDeltaker)
    this.deltaker.deltakerliste.tiltakskode = {
      kode: tiltakskode,
      visningsnavn: mockVisningsnavn(tiltakskode)
    }
    return HttpResponse.json(this.deltaker)
  }

  getStartdato(newStatusType?: DeltakerStatusType): Date | null {
    const statusType = newStatusType ?? this.statusType
    if (
      statusType === DeltakerStatusType.DELTAR ||
      statusType === DeltakerStatusType.HAR_SLUTTET ||
      statusType === DeltakerStatusType.FULLFORT ||
      statusType === DeltakerStatusType.AVBRUTT
    ) {
      const passertDato = new Date()
      passertDato.setDate(passertDato.getDate() - 15)
      return dayjs(passertDato).toDate()
    }
    return null
  }

  getSluttdato(newStatusType?: DeltakerStatusType): Date | null {
    const statusType = newStatusType ?? this.statusType
    if (statusType === DeltakerStatusType.DELTAR) {
      const fremtidigDato = new Date()
      fremtidigDato.setDate(fremtidigDato.getDate() + 10)
      return dayjs(fremtidigDato).toDate()
    }
    if (
      statusType === DeltakerStatusType.HAR_SLUTTET ||
      statusType === DeltakerStatusType.FULLFORT ||
      statusType === DeltakerStatusType.AVBRUTT
    ) {
      const passertDato = new Date()
      passertDato.setDate(passertDato.getDate() - 10)
      return dayjs(passertDato).toDate()
    }
    return null
  }

  getKodeverk(): KodeverkResponse {
    return lagOpplaringKategoriseringDeltaljertRespons(this.tiltakskode)
  }

  getForslag(): Forslag[] {
    if (this.deltaker?.deltakerliste.erEnkeltplass) {
      return []
    }

    const erFellesOppstart =
      this.deltaker?.deltakerliste.oppstartstype === Oppstartstype.FELLES
    if (this.statusType === DeltakerStatusType.DELTAR) {
      const sluttdato = dayjs(this.deltaker?.sluttdato)
        .add(3, 'months')
        .toDate()

      const startdato = dayjs(this.deltaker?.startdato).add(1, 'week').toDate()

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
          },
          harDeltatt: true,
          harFullfort: null
        }
      })
      const forslagAvslutt2 = aktivtForslag({
        begrunnelse: null,
        endring: {
          type: ForslagEndringType.AvsluttDeltakelse,
          sluttdato: sluttdato,
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
          startdato: startdato,
          sluttdato: sluttdato
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
          sluttdato: dayjs(this.deltaker?.sluttdato).add(7, 'days').toDate()
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

    if (this.deltaker?.deltakerId === deltakerId) {
      return new HttpResponse(null, { status: 200 })
    }

    return new HttpResponse(null, { status: 404 })
  }

  sendInnPameldingEnkeltplass(request: EnkeltplassPameldingRequest) {
    this.deltaker = {
      ...this.deltaker,
      deltakerliste: {
        ...this.deltaker?.deltakerliste,
        prisinformasjon: request.prisinformasjon
      },
      deltakelsesinnhold: {
        ...this.deltaker?.deltakelsesinnhold,
        innhold: request.beskrivelse
          ? [
              {
                tekst: '',
                innholdskode: INNHOLD_TYPE_ANNET,
                beskrivelse: request.beskrivelse,
                valgt: true
              }
            ]
          : []
      },
      startdato: request.startdato
        ? getDateFromString(request.startdato)
        : null,
      sluttdato: request.sluttdato
        ? getDateFromString(request.sluttdato)
        : null,
      dagerPerUke: request.dagerPerUke ?? null
    } as DeltakerResponse
    return HttpResponse.json(this.deltaker)
  }

  oppdaterEnkeltplassKladd(request: EnkeltplassKladdRequest) {
    if (this.deltaker === null) {
      return new HttpResponse(null, { status: 404 })
    }

    this.deltaker.dagerPerUke = request.dagerPerUke ?? null
    return new HttpResponse(null, { status: 200 })
  }

  sendInnPamelding(request: PameldingRequest) {
    if (this.deltaker === null) return new HttpResponse(null, { status: 404 })

    this.deltaker.bakgrunnsinformasjon = request.bakgrunnsinformasjon || null
    this.deltaker.dagerPerUke = request.dagerPerUke || null
    this.deltaker.deltakelsesprosent = request.deltakelsesprosent || null
    if (this.deltaker.deltakelsesinnhold !== null) {
      this.deltaker.deltakelsesinnhold.innhold =
        this.deltaker.deltakelsesinnhold.innhold.map((i) => {
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
    return HttpResponse.json(this.deltaker)
  }

  setStatus(status: DeltakerStatusType) {
    const oppdatertDeltaker = this.deltaker

    if (oppdatertDeltaker) {
      oppdatertDeltaker.kanEndres = status !== DeltakerStatusType.FEILREGISTRERT

      if (mockHarVedtak(status) && oppdatertDeltaker.vedtaksinformasjon) {
        oppdatertDeltaker.vedtaksinformasjon.fattet = dayjs()
          .subtract(2, 'day')
          .toDate()
      } else if (oppdatertDeltaker.vedtaksinformasjon) {
        oppdatertDeltaker.vedtaksinformasjon.fattet = null
      }
      oppdatertDeltaker.status.type = status
      if (status === DeltakerStatusType.AVBRUTT_UTKAST) {
        oppdatertDeltaker.status.aarsak = {
          type: DeltakerStatusAarsakType.SAMARBEIDET_MED_ARRANGOREN_ER_AVBRUTT,
          beskrivelse: null
        }
      } else if (status === DeltakerStatusType.AVBRUTT) {
        oppdatertDeltaker.status.aarsak = {
          type: DeltakerStatusAarsakType.FATT_JOBB,
          beskrivelse: null
        }
      } else if (status === DeltakerStatusType.IKKE_AKTUELL) {
        oppdatertDeltaker.status.aarsak = {
          type: DeltakerStatusAarsakType.ANNET,
          beskrivelse: 'Det er en annen grunn'
        }
      } else {
        oppdatertDeltaker.status.aarsak = null
      }
      oppdatertDeltaker.startdato = this.getStartdato(status)
      oppdatertDeltaker.sluttdato = this.getSluttdato(status)
      oppdatertDeltaker.forslag = this.getForslag()
      this.deltaker = oppdatertDeltaker
      return HttpResponse.json(oppdatertDeltaker)
    }
    return HttpResponse.json(this.deltaker)
  }

  setTiltakskode(tiltakskode: Tiltakskode) {
    const oppdatertDeltaker = this.deltaker
    const erEnkeltplassFraArena =
      tiltakskode === Tiltakskode.ENKELTPLASS_ARBEIDSMARKEDSOPPLAERING ||
      tiltakskode === Tiltakskode.ENKELTPLASS_FAG_OG_YRKESOPPLAERING ||
      tiltakskode === Tiltakskode.HOYERE_UTDANNING

    const erNyEnkeltplass =
      tiltakskode === Tiltakskode.ARBEIDSMARKEDSOPPLAERING ||
      tiltakskode === Tiltakskode.FAG_OG_YRKESOPPLAERING ||
      tiltakskode === Tiltakskode.HOYERE_YRKESFAGLIG_UTDANNING ||
      tiltakskode === Tiltakskode.STUDIESPESIALISERING ||
      tiltakskode === Tiltakskode.NORSKOPPLAERING_GRUNNLEGGENDE_FERDIGHETER_FOV

    if (oppdatertDeltaker) {
      oppdatertDeltaker.deltakerliste.tiltakskode = {
        kode: tiltakskode,
        visningsnavn: mockVisningsnavn(tiltakskode)
      }
      oppdatertDeltaker.deltakerliste.opplaringKategoriseringValg =
        erNyEnkeltplass
          ? lagOpplaringKategoriseringResponse(tiltakskode, erNyEnkeltplass)
          : null
      oppdatertDeltaker.adresseDelesMedArrangor =
        mockDelesAdresseMedArrangor(tiltakskode)

      const ledetekst = getLedetekst(tiltakskode)
      const innhold = getInnholdForTiltakskode(tiltakskode)
      oppdatertDeltaker.deltakerliste.tilgjengeligInnhold = {
        innhold,
        ledetekst
      }
      oppdatertDeltaker.deltakelsesinnhold = {
        innhold: getUtvidetInnhold(innhold),
        ledetekst
      }

      if (
        tiltakskode === Tiltakskode.ARBEIDSFORBEREDENDE_TRENING ||
        tiltakskode === Tiltakskode.VARIG_TILRETTELAGT_ARBEID_SKJERMET
      ) {
        oppdatertDeltaker.deltakelsesprosent = 80
        oppdatertDeltaker.dagerPerUke = 4
      } else {
        oppdatertDeltaker.deltakelsesprosent = null
        oppdatertDeltaker.dagerPerUke = null
      }

      if (harBakgrunnsinfo(tiltakskode)) {
        oppdatertDeltaker.bakgrunnsinformasjon = mockBakgrunnsinformasjon
      } else {
        oppdatertDeltaker.bakgrunnsinformasjon = null
      }

      if (erEnkeltplassFraArena) {
        oppdatertDeltaker.deltakerliste.erEnkeltplass = true
        oppdatertDeltaker.forslag = []
        oppdatertDeltaker.importertFraArena = {
          innsoktDato: dayjs().subtract(20, 'day').toDate()
        }
        oppdatertDeltaker.deltakerliste.prisinformasjon = null
      } else if (erNyEnkeltplass) {
        oppdatertDeltaker.deltakerliste.erEnkeltplass = true
        oppdatertDeltaker.importertFraArena = null
        oppdatertDeltaker.deltakerliste.prisinformasjon = {
          type: PrisinformasjonType.Anskaffelse,
          pris: 100000
        }
      } else {
        oppdatertDeltaker.importertFraArena = null
        oppdatertDeltaker.deltakerliste.erEnkeltplass = false
        oppdatertDeltaker.deltakerliste.prisinformasjon = null
      }

      this.deltaker = oppdatertDeltaker
    }
    return HttpResponse.json(this.deltaker)
  }

  setOppstartstype(oppstartstype: Oppstartstype) {
    const oppdatertDeltaker = this.deltaker

    if (oppdatertDeltaker) {
      oppdatertDeltaker.deltakerliste.oppstartstype = oppstartstype
      this.deltaker = oppdatertDeltaker
    }
    return HttpResponse.json(this.deltaker)
  }

  setErEnkeltplass(erEnkeltplass: boolean) {
    const oppdatertDeltaker = this.deltaker
    if (oppdatertDeltaker) {
      oppdatertDeltaker.deltakerliste.erEnkeltplass = erEnkeltplass
      if (erEnkeltplass) {
        oppdatertDeltaker.deltakerliste.oppmoteSted = null
        oppdatertDeltaker.startdato = dayjs().subtract(1, 'day').toDate()
        oppdatertDeltaker.sluttdato = dayjs().add(1, 'day').toDate()
        oppdatertDeltaker.bakgrunnsinformasjon = null
        oppdatertDeltaker.deltakerliste.prisinformasjon = {
          type: PrisinformasjonType.Anskaffelse,
          pris: 100000
        }
      } else {
        oppdatertDeltaker.deltakerliste.oppmoteSted =
          'Fjordgata 7b, 00 Stedet. Inngangsdør rundt svingen. Oppmøte kl. 09:00.'
        oppdatertDeltaker.startdato = this.getStartdato(
          oppdatertDeltaker.status.type
        )
        oppdatertDeltaker.sluttdato = this.getSluttdato(
          oppdatertDeltaker.status.type
        )
        oppdatertDeltaker.bakgrunnsinformasjon = mockBakgrunnsinformasjon
        oppdatertDeltaker.deltakerliste.prisinformasjon = null
      }
      oppdatertDeltaker.forslag = this.getForslag()
      this.deltaker = oppdatertDeltaker
    }

    return HttpResponse.json(this.deltaker)
  }

  setPameldingstype(pameldingstype: Pameldingstype) {
    const oppdatertDeltaker = this.deltaker

    if (oppdatertDeltaker) {
      oppdatertDeltaker.deltakerliste.pameldingstype = pameldingstype
      this.deltaker = oppdatertDeltaker
    }
    return HttpResponse.json(this.deltaker)
  }

  endreDeltakelseIkkeAktuell(request: IkkeAktuellRequest) {
    const oppdatertDeltaker = this.deltaker

    if (oppdatertDeltaker) {
      oppdatertDeltaker.status.type = DeltakerStatusType.IKKE_AKTUELL
      oppdatertDeltaker.status.aarsak = request.aarsak
      oppdatertDeltaker.startdato = null
      oppdatertDeltaker.sluttdato = null
      this.fjernAktivtForslag(request.forslagId)
      this.deltaker = oppdatertDeltaker
      return HttpResponse.json(oppdatertDeltaker)
    }

    return new HttpResponse(null, { status: 404 })
  }

  endreDeltakelseReaktiver() {
    const oppdatertDeltaker = this.deltaker

    if (oppdatertDeltaker) {
      oppdatertDeltaker.status.type = DeltakerStatusType.VENTER_PA_OPPSTART
      oppdatertDeltaker.startdato = null
      oppdatertDeltaker.sluttdato = null
      this.deltaker = oppdatertDeltaker
      return HttpResponse.json(oppdatertDeltaker)
    }

    return new HttpResponse(null, { status: 404 })
  }

  endreDeltakelseForleng(request: ForlengDeltakelseRequest) {
    const oppdatertDeltaker = this.deltaker

    if (oppdatertDeltaker) {
      oppdatertDeltaker.sluttdato = getDateFromString(request.sluttdato) ?? null
      this.fjernAktivtForslag(request.forslagId)
      this.deltaker = oppdatertDeltaker
      return HttpResponse.json(oppdatertDeltaker)
    }

    return new HttpResponse(null, { status: 404 })
  }

  endreDeltakelseStartdato(request: EndreStartdatoRequest) {
    const oppdatertDeltaker = this.deltaker

    if (oppdatertDeltaker) {
      oppdatertDeltaker.startdato = getDateFromString(request.startdato) ?? null
      oppdatertDeltaker.sluttdato = getDateFromString(request.sluttdato) ?? null
      this.deltaker = oppdatertDeltaker
      this.fjernAktivtForslag(request.forslagId)
      return HttpResponse.json(oppdatertDeltaker)
    }

    return new HttpResponse(null, { status: 404 })
  }

  endreDeltakelseBakgrunnsinfo(request: EndreBakgrunnsinfoRequest) {
    const oppdatertDeltaker = this.deltaker

    if (oppdatertDeltaker) {
      oppdatertDeltaker.bakgrunnsinformasjon = request.bakgrunnsinformasjon
      this.deltaker = oppdatertDeltaker
      return HttpResponse.json(oppdatertDeltaker)
    }

    return new HttpResponse(null, { status: 404 })
  }

  // TODO bruke request og fjerne _
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  endreDeltakelsePrisinfo(_request: EndrePrisinfoRequest) {
    const oppdatertDeltaker = this.deltaker

    if (oppdatertDeltaker) {
      // TODO lage et forslag for endring av prisinfo
      this.deltaker = oppdatertDeltaker
      return HttpResponse.json(oppdatertDeltaker)
    }

    return new HttpResponse(null, { status: 404 })
  }

  tilbakekallPrisendring() {
    const oppdatertDeltaker = this.deltaker

    if (oppdatertDeltaker) {
      oppdatertDeltaker.deltakerliste.prisinformasjonTilGodkjenning = null
      this.deltaker = oppdatertDeltaker
      return new HttpResponse(null, { status: 200 })
    }

    return new HttpResponse(null, { status: 404 })
  }

  endreDeltakelseFjernOppstartsdato(request: FjernOppstartsdatoRequest) {
    const oppdatertDeltaker = this.deltaker

    if (oppdatertDeltaker) {
      oppdatertDeltaker.startdato = null
      oppdatertDeltaker.sluttdato = null
      this.deltaker = oppdatertDeltaker
      this.fjernAktivtForslag(request.forslagId)
      return HttpResponse.json(oppdatertDeltaker)
    }

    return new HttpResponse(null, { status: 404 })
  }

  avsluttDeltakelse(request: AvsluttDeltakelseRequest) {
    const oppdatertDeltaker = this.deltaker
    const oppstartstype = oppdatertDeltaker?.deltakerliste.oppstartstype

    if (oppdatertDeltaker) {
      if (request.harDeltatt === false) {
        oppdatertDeltaker.status.type = DeltakerStatusType.IKKE_AKTUELL
        oppdatertDeltaker.status.aarsak = request.aarsak
        oppdatertDeltaker.startdato = null
        oppdatertDeltaker.sluttdato = null
      } else {
        if (oppstartstype === Oppstartstype.FELLES) {
          oppdatertDeltaker.status.type = request.harFullfort
            ? DeltakerStatusType.FULLFORT
            : DeltakerStatusType.AVBRUTT
        } else {
          oppdatertDeltaker.status.type = DeltakerStatusType.HAR_SLUTTET
        }
        oppdatertDeltaker.status.aarsak = request.aarsak
        oppdatertDeltaker.sluttdato =
          getDateFromString(request.sluttdato) ?? null
      }
      this.fjernAktivtForslag(request.forslagId)
      this.deltaker = oppdatertDeltaker
      return HttpResponse.json(oppdatertDeltaker)
    }

    return new HttpResponse(null, { status: 404 })
  }

  endreAvslutning(request: EndreAvslutningRequest) {
    const oppdatertDeltaker = this.deltaker

    if (oppdatertDeltaker) {
      if (request.harDeltatt === false) {
        oppdatertDeltaker.status.type = DeltakerStatusType.IKKE_AKTUELL
        oppdatertDeltaker.status.aarsak = request.aarsak
        oppdatertDeltaker.startdato = null
        oppdatertDeltaker.sluttdato = null
      } else {
        oppdatertDeltaker.status.type = request.harFullfort
          ? DeltakerStatusType.FULLFORT
          : DeltakerStatusType.AVBRUTT
        oppdatertDeltaker.status.aarsak = request.aarsak
        oppdatertDeltaker.sluttdato =
          getDateFromString(request.sluttdato) ?? null
      }
      this.fjernAktivtForslag(request.forslagId)
      this.deltaker = oppdatertDeltaker
      return HttpResponse.json(oppdatertDeltaker)
    }

    return new HttpResponse(null, { status: 404 })
  }

  endreDeltakelseSluttarsak(request: EndreSluttarsakRequest) {
    const oppdatertDeltaker = this.deltaker

    if (oppdatertDeltaker) {
      oppdatertDeltaker.status.type = DeltakerStatusType.HAR_SLUTTET
      oppdatertDeltaker.status.aarsak = request.aarsak
      this.deltaker = oppdatertDeltaker
      this.fjernAktivtForslag(request.forslagId)
      return HttpResponse.json(oppdatertDeltaker)
    }

    return new HttpResponse(null, { status: 404 })
  }

  endreDeltakelseInnhold(request: EndreInnholdRequest) {
    const oppdatertDeltaker = this.deltaker

    if (oppdatertDeltaker) {
      const nyListe: Innhold[] =
        oppdatertDeltaker.deltakerliste.tilgjengeligInnhold.innhold.map((i) => {
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
        })
      oppdatertDeltaker.deltakelsesinnhold = {
        ledetekst:
          oppdatertDeltaker.deltakerliste.tilgjengeligInnhold.ledetekst,
        innhold: nyListe
      }
      this.deltaker = oppdatertDeltaker
      return HttpResponse.json(this.deltaker)
    }

    return new HttpResponse(null, { status: 404 })
  }

  endreDeltakelseInnholdKodeverk(
    request: EndreInnholdOpplaringKategoriseringRequest
  ) {
    const oppdatertDeltaker = this.deltaker

    if (oppdatertDeltaker) {
      const detaljertKodeverk = this.getKodeverk()
      const visningsnavnById = new Map<string, string>()

      detaljertKodeverk.alternativer.forEach((alternativ) => {
        if (alternativ.type === 'Verdigruppe') {
          alternativ.alternativer.forEach((verdi) => {
            visningsnavnById.set(verdi.id, verdi.visningsnavn)
          })
        }

        if (alternativ.type === 'UtdanningGruppe') {
          alternativ.utdanninger.forEach((utdanning) => {
            utdanning.larefag.alternativer.forEach((larefag) => {
              visningsnavnById.set(larefag.id, larefag.visningsnavn)
            })
          })
        }
      })

      oppdatertDeltaker.deltakerliste.opplaringKategoriseringValg = {
        valgteKategoriseringer: request.opplaringKategoriseringValg.map(
          (valg) => ({
            type: valg.representerer,
            valgteElementer: valg.valgteIder.map((id) => ({
              id,
              visningsnavn: visningsnavnById.get(id) ?? id
            }))
          })
        ),
        valgteSertifiseringer: request.sertifiseringValg
      }
      oppdatertDeltaker.deltakelsesinnhold = {
        ledetekst: null,
        innhold: [
          {
            tekst: 'Annet',
            innholdskode: INNHOLD_TYPE_ANNET,
            valgt: true,
            beskrivelse: request.beskrivelse
          }
        ]
      }
      this.deltaker = oppdatertDeltaker
      return HttpResponse.json(this.deltaker)
    }

    return new HttpResponse(null, { status: 404 })
  }

  endreDeltakelsesmengde(request: EndreDeltakelsesmengdeRequest) {
    const oppdatertDeltaker = this.deltaker

    if (oppdatertDeltaker) {
      const nesteDeltakelsesmengde =
        oppdatertDeltaker.deltakelsesmengder.nesteDeltakelsesmengde
      const gyldigFra = dayjs(request.gyldigFra).toDate()
      if (gyldigFra <= new Date()) {
        oppdatertDeltaker.deltakelsesprosent =
          request.deltakelsesprosent || null
        oppdatertDeltaker.dagerPerUke = request.dagerPerUke || null
      } else if (
        nesteDeltakelsesmengde === null ||
        gyldigFra <= nesteDeltakelsesmengde.gyldigFra
      ) {
        if (
          request.dagerPerUke != oppdatertDeltaker.dagerPerUke ||
          request.deltakelsesprosent != oppdatertDeltaker.deltakelsesprosent
        ) {
          oppdatertDeltaker.deltakelsesmengder.nesteDeltakelsesmengde = {
            gyldigFra: gyldigFra,
            deltakelsesprosent: request.deltakelsesprosent ?? 100,
            dagerPerUke: request.dagerPerUke ?? null
          }
        } else {
          oppdatertDeltaker.deltakelsesmengder.nesteDeltakelsesmengde = null
        }
      }
      oppdatertDeltaker.deltakelsesmengder.sisteDeltakelsesmengde = {
        gyldigFra: gyldigFra,
        deltakelsesprosent: request.deltakelsesprosent ?? 100,
        dagerPerUke: request.dagerPerUke ?? null
      }
      this.deltaker = oppdatertDeltaker
      this.fjernAktivtForslag(request.forslagId)
      return HttpResponse.json(this.deltaker)
    }

    return new HttpResponse(null, { status: 404 })
  }

  avvisForslag(forslagId: string) {
    if (this.deltaker) {
      this.fjernAktivtForslag(forslagId)
      return HttpResponse.json(this.deltaker)
    }

    return new HttpResponse(null, { status: 404 })
  }

  fjernAktivtForslag(id: string | null | undefined) {
    if (id && this.deltaker) {
      this.deltaker.forslag = this.deltaker.forslag.filter((f) => f.id !== id)
    }
  }

  getHistorikk() {
    const erEnkeltplass = this.deltaker?.deltakerliste.erEnkeltplass
    const erFellesOppstart =
      this.deltaker?.deltakerliste.oppstartstype === Oppstartstype.FELLES
    return HttpResponse.json(
      erFellesOppstart || erEnkeltplass
        ? lagHistorikkFellesOppstart()
        : createHistorikk()
    )
  }

  sokSertifiseringer(soketekst: string) {
    return mockSertifiseringer.filter((it) => it.label.includes(soketekst))
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

export const sokArrangor = (term: string) => {
  const lower = term.toLowerCase()
  const result: { organisasjonsnummer: string; navn: string }[] = []

  for (const enhet of mockArrangorenheter) {
    const hovedenhetMatch = enhet.organisasjonsnummer === term

    if (hovedenhetMatch) {
      result.push(...enhet.underenheter)
    } else {
      for (const underenhet of enhet.underenheter) {
        if (
          underenhet.navn.toLowerCase().includes(lower) ||
          underenhet.organisasjonsnummer.includes(term)
        ) {
          result.push(underenhet)
        }
      }
    }
  }

  return result
}
