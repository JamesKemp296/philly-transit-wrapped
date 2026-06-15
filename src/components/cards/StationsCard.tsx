import { forwardRef } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { TbBuildingBridge, TbMapPin } from "react-icons/tb";
import CardCanvas from "./cardBase";
import { palette, pad, radius } from "../../theme";
import type { WrappedStats } from "../../lib/types";

const RANK_COLORS = [
  palette.yellow,
  palette.blue,
  palette.orange,
  palette.green,
  palette.pink,
];

const StationsCard = forwardRef<HTMLDivElement, { stats: WrappedStats }>(
  ({ stats }, ref) => {
    const top = stats.topStops[0];
    const rest = stats.topStops.slice(1);

    return (
      <CardCanvas ref={ref} background={palette.ink}>
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 700,
            opacity: 0.55,
            mb: 1,
          }}
        >
          Tap-ins
        </Typography>

        <Box
          sx={{
            bgcolor: palette.yellow,
            color: palette.ink,
            borderRadius: radius.md,
            p: pad.tileLg,
            mb: 1.5,
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Top station
            </Typography>
            <TbMapPin size={22} />
          </Stack>
          <Typography sx={{ fontWeight: 900, fontSize: 28, lineHeight: 1.05, mt: 0.5 }}>
            {top ? top.label : "—"}
          </Typography>
          {top && (
            <Typography sx={{ fontWeight: 800, fontSize: 14, mt: 0.5 }}>
              {top.count.toLocaleString()} taps
            </Typography>
          )}
        </Box>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <TbBuildingBridge size={18} />
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 700,
              opacity: 0.75,
            }}
          >
            Top 5
          </Typography>
        </Stack>

        <Stack spacing={1} sx={{ flex: 1 }}>
          {top &&
            [top, ...rest].map((s, i) => (
              <Stack
                key={s.label}
                direction="row"
                alignItems="center"
                spacing={1.25}
                sx={{
                  bgcolor: "rgba(255,255,255,0.06)",
                  borderRadius: radius.sm,
                  px: 1.5,
                  py: 1.25,
                }}
              >
                <Box
                  sx={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    bgcolor: RANK_COLORS[i % RANK_COLORS.length],
                    color: palette.ink,
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 900,
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </Box>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: 15,
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {s.label}
                </Typography>
                <Typography sx={{ fontWeight: 900, fontSize: 15, opacity: 0.85 }}>
                  {s.count}
                </Typography>
              </Stack>
            ))}
          {!top && (
            <Typography sx={{ opacity: 0.5 }}>—</Typography>
          )}
        </Stack>

        <Typography sx={{ fontWeight: 800, fontSize: 13, opacity: 0.7, mt: 1 }}>
          {stats.uniqueStops.toLocaleString()} stops total
        </Typography>
      </CardCanvas>
    );
  },
);

StationsCard.displayName = "StationsCard";
export default StationsCard;
