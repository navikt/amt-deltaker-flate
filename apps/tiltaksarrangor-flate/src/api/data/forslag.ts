import { z } from 'zod'
import { ForslagStatusType, forslagSchema } from 'deltaker-flate-common'

export const aktivtForslagSchema = forslagSchema
  .omit({ type: true, arrangorNavn: true })
  .extend({
    status: forslagSchema.shape.status.default({
      type: ForslagStatusType.VenterPaSvar
    })
  })

export type AktivtForslag = z.infer<typeof aktivtForslagSchema>
