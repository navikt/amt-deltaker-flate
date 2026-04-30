interface TransportItem {
  meta?: {
    page?: {
      url?: string
    }
  }
}

export function faroBeforeSend<T extends TransportItem>(item: T): T | null {
  // Fjern query-parametere fra side-URLer.
  // Kan inneholde tokens, autorisasjonskoder eller andre identifikatorer.
  if (item.meta?.page?.url) {
    try {
      const url = new URL(item.meta.page.url)
      url.search = ''
      item.meta.page.url = url.toString()
    } catch {
      /* ignore malformed URLs */
    }
  }

  // Dropp hele telemetri-elementet hvis payloaden inneholder et
  // 11-sifret mønster som kan være et fødselsnummer.
  const payload = JSON.stringify(item)
  if (/\d{11}/.test(payload)) {
    return null
  }

  return item
}
