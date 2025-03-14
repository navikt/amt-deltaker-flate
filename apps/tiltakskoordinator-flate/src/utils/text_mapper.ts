import { InnsatsbehovType } from '../api/data/deltaker'
import { Beskyttelsesmarkering } from '../api/data/deltakerliste'

export const getBeskyttelsesMarkeringTekst = (
  beskyttelsesmarkering: Beskyttelsesmarkering
) => {
  switch (beskyttelsesmarkering) {
    case Beskyttelsesmarkering.FORTROLIG:
      return 'Fortrolig adresse'
    case Beskyttelsesmarkering.STRENGT_FORTROLIG:
      return 'Strengt fortrolig adresse'
    case Beskyttelsesmarkering.STRENGT_FORTROLIG_UTLAND:
      return 'Strengt fortrolig adresse utland'
    case Beskyttelsesmarkering.SKJERMET:
      return 'Skjermet'
  }
}

export const getInsatsGruppeTekst = (innsatsgruppe: InnsatsbehovType) => {
  switch (innsatsgruppe) {
    case InnsatsbehovType.STANDARD_INNSATS:
      return 'Gode muligheter'
    case InnsatsbehovType.SITUASJONSBESTEMT_INNSATS:
      return 'Trenger veiledning'
    case InnsatsbehovType.SPESIELT_TILPASSET_INNSATS:
      return 'Trenger veiledning, nedsatt arbeidsevne'
    case InnsatsbehovType.VARIG_TILPASSET_INNSATS:
      return 'Liten mulighet til å jobbe'
    case InnsatsbehovType.GRADERT_VARIG_TILPASSET_INNSATS:
      return 'Jobbe delvis'
  }
}

export const getInsatsGruppeGammelTekst = (innsatsgruppe: InnsatsbehovType) => {
  switch (innsatsgruppe) {
    case InnsatsbehovType.STANDARD_INNSATS:
      return 'Standard'
    case InnsatsbehovType.SITUASJONSBESTEMT_INNSATS:
      return 'Situasjonsbestemt'
    case InnsatsbehovType.SPESIELT_TILPASSET_INNSATS:
      return 'Spesielt tilpasset'
    case InnsatsbehovType.VARIG_TILPASSET_INNSATS:
      return 'Varig tilpasset'
    case InnsatsbehovType.GRADERT_VARIG_TILPASSET_INNSATS:
      return 'Delvis, varig tilpasset'
  }
}
