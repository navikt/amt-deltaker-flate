import {
  FeatureToggles,
  featureToggleSchema,
  TOGGLES
} from './feature-toggle-data.ts'
import { logError } from '../utils/utils.ts'

export const fetchToggles = (baseUrl: string): Promise<FeatureToggles> => {
  const features = TOGGLES.map((feature) => `feature=${feature}`).join('&')
  const url = `${baseUrl}/unleash/api/feature?${features}`
  return fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  })
    .then((response) => response.json())
    .then(featureToggleSchema.parse)
    .catch((error) => {
      logError('Kunne ikke parse featureToggleSchema:', error)
      throw new Error('Kunne ikke parse featureToggleSchema')
    })
}
