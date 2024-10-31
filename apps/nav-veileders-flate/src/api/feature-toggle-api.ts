import {
  FeatureToggles,
  featureToggleSchema,
  TOGGLES
} from './data/feature-toggle'
import { API_URL } from '../utils/environment-utils.ts'
import { logError } from 'deltaker-flate-common'

export const fetchToggles = (): Promise<FeatureToggles> => {
  const features = TOGGLES.map((feature) => `feature=${feature}`).join('&')
  const url = `${API_URL}/unleash/api/feature?${features}`
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
