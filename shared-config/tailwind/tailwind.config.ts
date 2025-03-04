import type { Config } from 'tailwindcss'

import generated from '@navikt/ds-tailwind'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/deltaker-flate-common/components/**/*.{js,ts,jsx,tsx}'
  ],
  presets: [generated],
  theme: {
    extend: {}
  },
  plugins: []
}

export default config
