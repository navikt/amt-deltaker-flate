import '@testing-library/jest-dom'
import dayjs from 'dayjs'
import nb from 'dayjs/locale/nb'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import duration from 'dayjs/plugin/duration'

dayjs.locale(nb)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.extend(duration)
