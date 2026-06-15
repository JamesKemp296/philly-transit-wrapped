import { createTheme } from '@mui/material/styles'
import { METRO_LINES } from './lib/septa'

export const palette = {
  ink: '#0a0a0a',
  paper: '#f4f1ea',
  // SEPTA METRO line colors
  metroB: METRO_LINES.B.color,
  metroL: METRO_LINES.L.color,
  metroT: METRO_LINES.T.color,
  metroG: METRO_LINES.G.color,
  metroD: METRO_LINES.D.color,
  metroM: METRO_LINES.M.color,
  // General UI aliases
  blue: METRO_LINES.L.color,
  orange: METRO_LINES.B.color,
  green: METRO_LINES.T.color,
  yellow: METRO_LINES.G.color,
  pink: METRO_LINES.D.color,
  purple: METRO_LINES.M.color,
  red: '#E8403F',
  bus: '#E8403F',
  white: '#ffffff',
}

/** Shared layout tokens — slightly tighter corners, more breathing room inside tiles. */
export const radius = {
  sm: 2.5,
  md: 3,
  lg: 3.5,
}

export const pad = {
  tile: 2,
  tileLg: 2.5,
  card: 3,
}

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: palette.blue },
    secondary: { main: palette.orange },
    background: {
      default: palette.ink,
      paper: palette.white,
    },
    text: {
      primary: palette.ink,
    },
  },
  typography: {
    fontFamily: 'Archivo, "Helvetica Neue", Helvetica, Arial, sans-serif',
    h1: { fontWeight: 900, letterSpacing: '-0.02em' },
    h2: { fontWeight: 900, letterSpacing: '-0.02em' },
    h3: { fontWeight: 800, letterSpacing: '-0.01em' },
    h4: { fontWeight: 800 },
    button: { fontWeight: 800, textTransform: 'none' },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 999, paddingInline: 22, paddingBlock: 10 },
      },
    },
  },
})

export default theme
