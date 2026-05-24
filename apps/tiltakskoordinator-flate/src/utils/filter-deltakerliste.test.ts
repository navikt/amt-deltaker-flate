import { DeltakerStatusType, Pameldingstype } from 'deltaker-flate-common'
import { describe, expect, it } from 'vitest'
import { getDefaultStatusFilter } from './filter-deltakerliste'

describe('getDefaultStatusFilter', () => {
  it('inkluderer kun VENTER_PA_OPPSTART og DELTAR for DIREKTE_VEDTAK', () => {
    const result = getDefaultStatusFilter(Pameldingstype.DIREKTE_VEDTAK)
    expect(result).toEqual([
      DeltakerStatusType.VENTER_PA_OPPSTART,
      DeltakerStatusType.DELTAR
    ])
  })

  it('inkluderer SOKT_INN og VENTELISTE for TRENGER_GODKJENNING', () => {
    const result = getDefaultStatusFilter(Pameldingstype.TRENGER_GODKJENNING)
    expect(result).toContain(DeltakerStatusType.SOKT_INN)
    expect(result).toContain(DeltakerStatusType.VENTELISTE)
  })

  it('setter SOKT_INN og VENTELISTE foran VENTER_PA_OPPSTART og DELTAR for TRENGER_GODKJENNING', () => {
    const result = getDefaultStatusFilter(Pameldingstype.TRENGER_GODKJENNING)
    expect(result).toEqual([
      DeltakerStatusType.SOKT_INN,
      DeltakerStatusType.VENTELISTE,
      DeltakerStatusType.VENTER_PA_OPPSTART,
      DeltakerStatusType.DELTAR
    ])
  })
})
