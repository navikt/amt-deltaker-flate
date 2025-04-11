import { z } from 'zod'

export const LES_ARENA_DELTAKERE_TOGGLE_NAVN = 'amt.les-arena-deltakere'
export const KOMET_ER_MASTER = 'amt.enable-komet-deltakere'

export const featureToggleSchema = z.object({
  [LES_ARENA_DELTAKERE_TOGGLE_NAVN]: z.boolean(),
  [KOMET_ER_MASTER]: z.boolean()
})

export const TOGGLES = featureToggleSchema.keyof().options

export type FeatureToggles = z.infer<typeof featureToggleSchema>
