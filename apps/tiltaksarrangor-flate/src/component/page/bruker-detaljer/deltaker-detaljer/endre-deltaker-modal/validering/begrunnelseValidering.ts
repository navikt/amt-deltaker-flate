import { BEGRUNNELSE_MAKS_TEGN } from '../../../../../../utils/endre-deltaker-utils'

export function validerObligatoriskBegrunnelse(begrunnelse: string) {
  return new Promise((resolve, reject) => {
    if (begrunnelse.trim() === '') {
      return reject('Begrunnelse mangler')
    }
    if (begrunnelse.length > BEGRUNNELSE_MAKS_TEGN) {
      return reject(
        `Begrunnelsen kan ikke være over ${BEGRUNNELSE_MAKS_TEGN} tegn`
      )
    }
    resolve(begrunnelse)
  })
}

export function gyldigObligatoriskBegrunnelse(begrunnelse: string) {
  return (
    begrunnelse.trim() !== '' && begrunnelse.length <= BEGRUNNELSE_MAKS_TEGN
  )
}
