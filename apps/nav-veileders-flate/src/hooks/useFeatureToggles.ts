import { useFeatureToggle } from 'deltaker-flate-common'
import { API_URL } from '../utils/environment-utils.ts'

export const useFeatureToggles = () => {
  const { erKometMasterForTiltak } = useFeatureToggle(API_URL)

  return {
    erKometMasterForTiltak
  }
}
