import { API_URL } from '../utils/environment-utils.ts'
import { useFeatureToggle } from '../../../../packages/deltaker-flate-common/feature-toggle/useFeatureToggle.ts'

export const useFeatureToggles = () => {
  const { erKometMasterForTiltak } = useFeatureToggle(API_URL)

  return {
    erKometMasterForTiltak
  }
}
