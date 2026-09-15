import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import dayjs from 'dayjs'
import nb from 'dayjs/locale/nb'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import duration from 'dayjs/plugin/duration'

dayjs.locale(nb)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.extend(duration)

// Auto-clean between tests
afterEach(() => {
  cleanup()
})
