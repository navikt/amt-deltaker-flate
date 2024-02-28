export enum TabId {
  AKTIVITETSPLAN = 'AKTIVITETSPLAN',
  DIALOG = 'DIALOG',
  VEDTAKSSTOTTE = 'VEDTAKSSTOTTE',
  DETALJER = 'DETALJER',
  OVERBLIKK = 'OVERBLIKK',
  ARBEIDSMARKEDSTILTAK = 'ARBEIDSMARKEDSTILTAK',
  FINN_STILLING_INNGANG = 'FINN_STILLING_INNGANG'
}

const TabEvents = [
  {
    tabId: TabId.AKTIVITETSPLAN,
    event: 'veilarbpersonflatefs.setAktivitetsplanTab'
  }
]

interface UseModiaLink {
  doRedirect: (tab: TabId, path: string) => void
}

export const useModiaLink = (): UseModiaLink => {

  const doRedirect = (tab: TabId, path: string) => {
    const tabEvent = TabEvents.find((it) => it.tabId === tab)

    if (tabEvent) {
      window.dispatchEvent(new CustomEvent(tabEvent.event))
    }

    window.history.pushState(null, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))

  }

  return {doRedirect}

}
