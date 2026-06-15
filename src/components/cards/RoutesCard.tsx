import { forwardRef } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { TbBus, TbTrain, TbRoute } from "react-icons/tb";
import CardCanvas from "./cardBase";
import MetroLineBadge from "../MetroLineBadge";
import { palette, pad, radius } from "../../theme";
import { MODE_COLORS, metroLineForName } from "../../lib/septa";
import type { RideMode, WrappedStats } from "../../lib/types";

const RoutesCard = forwardRef<HTMLDivElement, { stats: WrappedStats }>(
  ({ stats }, ref) => {
    const total = stats.totalTrips || 1;
    const bars = stats.modeBreakdown.filter((m) => m.count > 0);
    const topRailMetro = stats.topRailLine
      ? metroLineForName(stats.topRailLine.label)
      : null;
    const railBg = topRailMetro?.color ?? palette.blue;
    const railFg = topRailMetro?.textColor ?? palette.white;

    return (
      <CardCanvas ref={ref} background={palette.ink}>
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            opacity: 0.6,
            mb: 1,
          }}
        >
          Your go-to lines
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1.25,
            mb: 1.5,
          }}
        >
          <Box sx={{ bgcolor: palette.red, color: palette.white, borderRadius: radius.md, p: pad.tile }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography sx={{ fontSize: 11, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Top Bus Route
              </Typography>
              <TbBus size={20} />
            </Stack>
            <Typography sx={{ fontWeight: 900, fontSize: 30, lineHeight: 1.05, mt: 0.5 }}>
              {stats.topBusRoute ? stats.topBusRoute.label.replace("Route ", "") : "—"}
            </Typography>
            <Typography sx={{ fontWeight: 800, fontSize: 12, opacity: 0.9 }}>
              {stats.topBusRoute ? `${stats.topBusRoute.count} trips` : "no bus trips"}
            </Typography>
          </Box>

          <Box sx={{ bgcolor: railBg, color: railFg, borderRadius: radius.md, p: pad.tile }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography sx={{ fontSize: 11, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Top Rail Line
              </Typography>
              <TbTrain size={20} />
            </Stack>
            {topRailMetro ? (
              <Stack spacing={0.5} sx={{ mt: 0.75 }}>
                <MetroLineBadge line={topRailMetro} size="md" />
                <Typography sx={{ fontWeight: 700, fontSize: 12, lineHeight: 1.25, opacity: 0.9 }}>
                  {topRailMetro.name}
                </Typography>
              </Stack>
            ) : (
              <Typography sx={{ fontWeight: 900, fontSize: 18, lineHeight: 1.1, mt: 0.5 }}>
                {stats.topRailLine ? stats.topRailLine.label : "—"}
              </Typography>
            )}
            <Typography sx={{ fontWeight: 800, fontSize: 12, opacity: 0.9, mt: 0.5 }}>
              {stats.topRailLine ? `${stats.topRailLine.count} trips` : "no rail trips"}
            </Typography>
          </Box>
        </Box>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <TbRoute size={18} />
          <Typography sx={{ fontSize: 12, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.85 }}>
            How you got around
          </Typography>
        </Stack>

        <Stack spacing={1.25} sx={{ mb: 1.5 }}>
          {bars.map((m) => {
            const pct = Math.round((m.count / total) * 100);
            const color = MODE_COLORS[m.label as RideMode] ?? palette.white;
            return (
              <Box key={m.label}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 13 }}>{m.label}</Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: 13, opacity: 0.8 }}>
                    {pct}%
                  </Typography>
                </Stack>
                <Box sx={{ bgcolor: "rgba(255,255,255,0.1)", borderRadius: 999, height: 12 }}>
                  <Box
                    sx={{
                      width: `${Math.max(pct, 3)}%`,
                      height: "100%",
                      borderRadius: 999,
                      bgcolor: color,
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </Stack>

        <Box sx={{ flex: 1 }} />

        <Stack spacing={0.75}>
          {stats.topRoutes.slice(0, 3).map((r, i) => {
            const metro = metroLineForName(r.label);
            return (
              <Stack
                key={r.label}
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ bgcolor: "rgba(255,255,255,0.06)", borderRadius: radius.sm, px: 1.5, py: 1 }}
              >
                <Typography sx={{ fontWeight: 900, fontSize: 13, opacity: 0.6, width: 18 }}>
                  {i + 1}
                </Typography>
                {metro && <MetroLineBadge line={metro} size="sm" />}
                <Typography sx={{ fontWeight: 700, fontSize: 14, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {metro ? metro.name : r.label}
                </Typography>
                <Typography sx={{ fontWeight: 900, fontSize: 14, opacity: 0.85 }}>
                  {r.count}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      </CardCanvas>
    );
  },
);

RoutesCard.displayName = "RoutesCard";
export default RoutesCard;
