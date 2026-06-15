import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { palette, pad, radius } from '../../theme'
import SeptaLogo from '../SeptaLogo'

export const CARD_W = 384
export const CARD_H = 683

interface CardCanvasProps {
  children: ReactNode
  background?: string
  /** Color of the header/footer text + logo box contrast. */
  dark?: boolean
}

/**
 * The exportable card surface. The ref points at the node captured by
 * html-to-image, so nothing outside of this (e.g. the download button) is
 * included in the shared image.
 */
const CardCanvas = forwardRef<HTMLDivElement, CardCanvasProps>(
  ({ children, background = palette.ink, dark = true }, ref) => {
    const fg = dark ? palette.white : palette.ink
    const logoBg = dark ? palette.white : palette.ink
    return (
      <Box
        ref={ref}
        sx={{
          width: CARD_W,
          height: CARD_H,
          background,
          color: fg,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          p: pad.card,
          fontFamily: 'Archivo, Helvetica, Arial, sans-serif',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
          <Box
            sx={{
              height: 30,
              px: 0.5,
              borderRadius: 0.8,
              bgcolor: logoBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SeptaLogo height={20} />
          </Box>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: 13,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              opacity: 0.85,
            }}
          >
            SEPTA Wrapped
          </Typography>
        </Stack>

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          {children}
        </Box>

        <Typography
          sx={{
            mt: 1.5,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            opacity: 0.6,
            textAlign: 'center',
          }}
        >
          septa-wrapped
        </Typography>
      </Box>
    )
  },
)

CardCanvas.displayName = 'CardCanvas'

export default CardCanvas

interface StatBlockProps {
  label: string
  value: ReactNode
  bg: string
  fg?: string
  icon?: ReactNode
  big?: boolean
}

/** A bold color-block stat tile, echoing the METRO Rewind grid look. */
export function StatBlock({
  label,
  value,
  bg,
  fg = palette.ink,
  icon,
  big = false,
}: StatBlockProps) {
  return (
    <Box
      sx={{
        bgcolor: bg,
        color: fg,
        borderRadius: radius.sm,
        p: pad.tile,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        minHeight: big ? 130 : 96,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            opacity: 0.85,
          }}
        >
          {label}
        </Typography>
        {icon}
      </Stack>
      <Typography
        sx={{
          fontWeight: 900,
          lineHeight: 1,
          fontSize: big ? 52 : 34,
          letterSpacing: '-0.02em',
          mt: 1,
        }}
      >
        {value}
      </Typography>
    </Box>
  )
}
