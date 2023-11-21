import type {Config} from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  screens: {
    xs: '480px',
    ss: '620px',
    sm: '768px',
    md: '1024px',
    lg: '1279px',
    xl: '1700px',
  },
  plugins: [],
}

export default config
