const DELTAKER_SESSION_STORAGE_KEY = 'arbeidsmarkedstiltak_deltaker'
export interface DetlakerStateSessionStorage {
  brukerIKontekst: string
}

export const deltakerStateFromSessionStorage = () => {
  return JSON.parse(sessionStorage.getItem(DELTAKER_SESSION_STORAGE_KEY) ?? '')
}

export const setPersonidentISessionStorage = (personident: string) => {
  const data: DetlakerStateSessionStorage = {
    brukerIKontekst: personident
  }
  sessionStorage.setItem(DELTAKER_SESSION_STORAGE_KEY, JSON.stringify(data))
}
